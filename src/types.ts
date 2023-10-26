//----照片牆貼文----//

export interface CommentType {
  authorId: string;
  photoPostId: string;
  content: string;
}

export interface CommentFilledType {
  _id: string;
  author: {
    username: string;
    selectedAvatarIndex: number;
    createdAt: string;
  };
  photoPostId: string;
  content: string;
  createdAt: string;
}

export interface PhotoPostImageType {
  url: string;
  filename: string;
}

export interface NewPhotoPostType {
  title: string;
  images: PhotoPostImageType[];
  location: string;
  geometry: {
    type: "point";
    coordinates: number[];
  };
  description: string;
  authorId: string;
  views: 0;
  likes: 0;
  comments: [];
  isEdit: false;
}

export interface PhotoPostFilledType {
  _id: string;
  title: string;
  images: PhotoPostImageType[];
  location: string;
  geometry?: any;
  description: string;
  authorInfo: {
    authorName: string;
    authorAvatarIndex: number;
  };
  views: number;
  likes: number;
  comments: CommentFilledType[];
  isEdit: boolean;
  createdAt: string;
}

//----用戶----//
export interface UserDataPostType {
  email: string;
  password: string;
  selectedAvatarIndex: number;
  selectedTags: string[];
  username: string;
  intro?: string;
}

export interface UserDataType {
  email: string;
  password: string;
  selectedAvatarIndex: number;
  selectedTags: string[];
  username: string;
  intro?: string;
  _id: string;
}

//----社區----//

export interface CommunityPostType {
  title: string;
  authorId: string;
  images?: PhotoPostImageType[] | null;
  content: string;
  likes: number;
  views: number;
  topicTags: string[];
  commentsId: string[];
  isEdit: boolean;
}

//----全域彈窗框
export interface DialogType {
  title: string;
  content: string;
  warringStyle?: boolean;
  cancelButton?: boolean;
}
