<script setup lang="ts">
import TheHeader from '../components/layout/TheHeader.vue';
import { ref, onMounted } from 'vue';
import { getGalleryData } from '../api/gallery.ts';
import mapboxgl from 'mapbox-gl';
import MapBoxGeoCoder from '@mapbox/mapbox-gl-geocoder';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-geocoder/lib/mapbox-gl-geocoder.css';
import { useLoadingStore } from '../store/loading';


const mapContainer = ref<HTMLElement | null>(null);
let currentPopup: mapboxgl.Popup | null = null;

onMounted(async () => {
    const loadingStore = useLoadingStore();
    loadingStore.setLoadingStatus(true);
    loadingStore.setInRequest(true);
    const animalsDataset = await getGalleryData();

    const geoJSONFeatures = animalsDataset.map(animalsData => ({
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: animalsData.geometry.coordinates
        },
        properties: {
            _id: animalsData._id,
            title: animalsData.title,
            location: animalsData.location,
            url: animalsData.image[0].url,
        }
    }));

    mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_TOKEN;

    //定義地圖實例
    const map = new mapboxgl.Map({
        container: mapContainer.value!,
        style: 'mapbox://styles/mapbox/light-v10',
        center: [120.93874358912397, 23.92239934359359],
        zoom: 2
    });

    const language = new MapboxLanguage({ defaultLanguage: 'zh-Hant' });
    map.addControl(language);

    function setPopup(coordinates: mapboxgl.LngLatLike, properties) {
        const popupElement = ` 
      <div class="transition-all bg-white duration-700 ease-in rounded-sm  shadow-md shadow-gray-800 cursor-pointer hover:scale-105 border-t-8 border-2 border-b border-stone-600 flex">
          <img src=${properties.url} alt="animal" class="w-52 rounded-sm  rounded-r-none shadow-xl">
          <div class="relative rounded-r-sm border-l-0 flex flex-col justify-between items-center flex-1 p-4 max-w-[6rem]">
            <div class="my-2 w-full h-full overflow-hidden flex flex-col justify-between items-center">
                <div>
              <p class="text-xl font-bold text-center leading-6 line-clamp-2">${properties.title}</p>
              <p class="text-gray-500 text-center text-xs truncate" mt-1>${properties.location}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 text-stone-700 hover:text-blue-700 hover:scale-105  transition-all duration-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
           </div>
      </div>
    `;

        const pop = new mapboxgl.Popup({ offset: 0, closeButton: false, className: 'popcard' })

        pop.setLngLat(coordinates)
            .setHTML(popupElement)
            .setMaxWidth("50vw")
            .addTo(map);
        currentPopup = pop;
    }

    const searchData = {
        features: geoJSONFeatures,
        type: 'FeatureCollection'
    };

    //定義地圖搜索函數
    function forwardGeocoder(query: string) {
        const matchingFeatures = [];
        for (const feature of searchData.features) {
            if (feature.properties.title.toLowerCase().includes(query.toLowerCase())) {
                feature['place_name'] = feature.properties.title;
                feature['center'] = feature.geometry.coordinates;
                feature['place_type'] = ['animal'];
                matchingFeatures.push(feature);
            }
        }
        return matchingFeatures;
    }

    //定義地圖地理編碼實例
    const geocoder = new MapBoxGeoCoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: forwardGeocoder,
        localGeocoderOnly: true,
        marker: false,
        language: 'zh',
        minLength: 1,
        zoom: 14,
        placeholder: '動物名稱',
        mapboxgl: mapboxgl
    });

    //將地圖設為2d平面
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    map.on('load', () => {

        map.addSource('geoData', {  // 掛載 geoData 數據，並設置集群
            type: 'geojson',
            data: { features: geoJSONFeatures },
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50
        });

        map.addLayer({  //添加集群圈
            id: 'clusters',
            type: 'circle',
            source: 'geoData',
            filter: ['has', 'point_count'],
            paint: {  //樣式及判定標準設置
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#51bbd6',
                    10,
                    '#3aba55',
                    20,
                    '#f28cb1'
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    10,
                    10,
                    20,
                    20,
                    30
                ]
            }
        });

        map.addLayer({ //添加符號(數字)
            id: 'cluster-count',
            type: 'symbol',
            source: 'geoData',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });

        map.addLayer({ //添加個體定位點
            id: 'unclustered-point',
            type: 'circle',
            source: 'geoData',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#51bbd6',
                'circle-radius': 5,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
            }
        });

        //集群點擊聚焦事件
        map.on('click', 'clusters', (e: mapboxgl.MapMouseEvent) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });

            const clusterId = features[0].properties.cluster_id;
            map.getSource('geoData').getClusterExpansionZoom(
                clusterId,
                (err: Error | null, zoom: number) => {
                    if (err) return;

                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        });

        //集群點擊彈窗事件
        map.on('click', 'unclustered-point', (e: mapboxgl.MapMouseEvent) => {
            setPopup(e.features[0].geometry.coordinates, e.features[0].properties)
        });

        map.on('mouseenter', 'clusters', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', () => {
            map.getCanvas().style.cursor = '';
        });


        //掛載地理編碼器
        map.addControl(geocoder);
        geocoder.on('result', (e: mapboxgl.MapBoxEvent) => {
            if (currentPopup) {
                currentPopup.remove();
            }

            setPopup(e.result.center, e.result.properties);

        });
    });    
    loadingStore.setInRequest(false);
    loadingStore.setLoadingStatus(false);
});
</script>

<template>
    <div class="flex flex-col h-screen">
        <TheHeader :is-login="false" />
        <div class="bg-stone-600 p-1 pt-0 flex-grow">
            <div ref="mapContainer" class="w-full h-full rounded-sm"></div>
        </div>

    </div>
</template>

<style> .mapboxgl-popup-anchor-top .mapboxgl-popup-tip,
 .mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip,
 .mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip {
     border-bottom-color: #57534e;
 }

 .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip,
 .mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip,
 .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip {
     border-top-color: #57534e;
 }

 .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
     border-right-color: #57534e;
 }

 .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
     border-left-color: #57534e;
 }

 .mapboxgl-popup-content {
     border: none !important;
     box-shadow: none !important;
     background-color: transparent !important;
 }
</style>

