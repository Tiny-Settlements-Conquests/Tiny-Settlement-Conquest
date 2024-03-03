export abstract class Resource {
    protected _image: HTMLImageElement = new Image();
    public getImage(): HTMLImageElement {
        return this._image
    }

    public getImageSrc(): string {
        return this._image.src;
    }
}