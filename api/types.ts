export interface BaseMessage {
  type: string;
}

export interface TextMessage extends BaseMessage {
  type: "text";
  text: string;
  emojis?: Array<
    { index: number; length: number; productId: string; emojiId: string }
  >;
  quoteToken?: string;
}
export interface TemplateMessage extends BaseMessage {
  type: "template";
  altText: string;
  template:
    | ButtonTemplate
    | ConfirmTemplate
    | CarouselTemplate
    | ImageCarouselTemplate;
}

export interface ButtonTemplate {
  type: "buttons";
  thumbnailImageUrl?: string;
  imageAspectRatio?: "rectangle" | "square";
  imageSize?: "cover" | "contain";
  title?: string;
  text: string;
  defaultAction?: Action;
  actions: Action[];
}

export interface ConfirmTemplate {
  type: "confirm";
  text: string;
  actions: Action[];
}

export interface CarouselTemplate {
  type: "carousel";
  columns: Column[];
}

export interface ImageCarouselTemplate {
  type: "image_carousel";
  columns: ImageColumn[];
}
export interface Column {
  imageBackgroundColor?: string;
  title?: string;
  text: string;
  defaultAction: Action;
  actions: Action[];
}
export interface ImageColumn {
  imageUrl: string;
  action: Action;
}
export interface FlexCarouselMessage extends BaseMessage {
  type: "carousel";
  contents: FlexMessageBubble[];
}

export interface FlexMessageBubble {
  type: "bubble";
  size: string;
  header: FlexMessageBox;
  body: FlexMessageBody;
  footer: FlexMessageBox;
}

type FlexMessageBody = FlexMessageBox;

export interface FlexMessageBox {
  type: "box";
  layout: string;
  contents: Array<FlexMessageBox | FlexMessageContent>;
  spacing?: string;
  paddingAll?: string;
  paddingTop?: string;
  paddingBottom?: string;
}

export interface FlexMessageContent {
  type: string;
  action?: Action;
  text?: string;
  weight?: string;
  size?: string;
  wrap?: boolean;
}

type Action = MessageAction | URIAction;

export interface MessageAction {
  type: "message";
  label: string;
  text: string;
}

export interface URIAction {
  type: "uri";
  label: string;
  uri: string;
  altUri?: { desktop: string };
}

export interface Webhook {
  destination: string;
  events: WebhookEvent[];
}

export interface WebhookEvent {
  type: "message" | string;
  mode: "active" | "stanby";
  timestamp: number;
  source?: WebhookSource;
  webhookEventId: string;
  deliveryContext: { isRedelivery: boolean };
}

export interface WebhookSource {
  type: string;
  groupId?: string;
  roomId?: string;
  userId?: string;
}

export interface MessageEvent extends WebhookEvent {
  type: "message";
  replyToken: string;
  message:
    | TextEventMessage
    | ImageEventMessage
    | VideoEventMessage
    | AudioEventMessage
    | FileEventMessage
    | LocationEventMessage;
}

export interface AccountLinkEvent extends WebhookEvent {
  type: "accountLink";
  replyToken: string;
  link: { result: "ok" | "failed"; nonce: string };
}

export interface TextEventMessage {
  id: string;
  type: "text";
  quoteToken: string;
  text: string;
  emojis?: Array<
    { index: number; length: number; productId: string; emojiId: string }
  >;
  mention?: {
    mentionees: Array<
      { index: number; length: number; type: "user" | "all"; userId?: string }
    >;
  };
  quotedMessageId?: string;
}

interface ImageEventMessage {
  id: string;
  type: "image";
  contentProvider: {
    type: "line" | "external";
    originalContentUrl?: string;
    previewImageUrl?: string;
  };
  imageSet: { id: string; index: number; total: number };
}

interface VideoEventMessage
  extends Omit<ImageEventMessage, "type" | "imageSet"> {
  type: "video";
  duration?: number;
}

interface AudioEventMessage extends Omit<VideoEventMessage, "type"> {
  type: "audio";
}

interface FileEventMessage {
  id: string;
  type: "file";
  fileName: string;
  fileSize: number;
}

interface LocationEventMessage {
  id: string;
  type: "location";
  title?: string;
  address?: string;
  latitude: number;
  longitude: number;
}
