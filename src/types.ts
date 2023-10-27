//----照片牆貼文----//

export interface CommentType {
  _id?: string;
  authorId: string;
  postId: string;
  content: string;
  createdAt?: string;
}

export interface CommentFilledType {
  _id: string;
  author?: {
    username: string;
    selectedAvatarIndex: number;
    createdAt: string;
  };
  postId: string;
  content: string;
  createdAt: string;
}

export interface PhotoPostImageType {
  url: string;
  filename: string;
}

export interface PhotoPostType {
  _id: string;
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
  createdAt?: string,
  commentsId: [];
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

export interface AuthorDataType {
  username: string,
  selectedAvatarIndex: number;
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
  createdAt?: string,
  _id?: string
}

//----全域彈窗框
export interface DialogType {
  title: string;
  content: string;
  warringStyle?: boolean;
  cancelButton?: boolean;
}
