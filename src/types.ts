//照片牆貼文//

export interface CommentType {
  authorId: object;
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

export interface PhotoPostType {
  title: string;
  image: PhotoPostImageType[];
  location: string;
  description: string;
  authorId: string;
  views: number;
  likes: number;
  comments: CommentType[];
  isEdit: boolean;
}

export interface PhotoPostFilledType {
  _id: string;
  title: string;
  image: PhotoPostImageType[];
  location: string;
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

//用戶及註冊表單//

export interface FormInputType {
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
  selectedAvatarIndex: number;
}

export interface FormInputInvalidType {
  email: {
    valid: boolean;
    registered: boolean;
  };
  username: boolean;
  password: boolean;
  passwordConfirm: boolean;
}

//全局彈窗框
export interface DialogType {
  title: string,
  content: string,
  warringStyle?: boolean
}
