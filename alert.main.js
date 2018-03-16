/**
 * @type {string}
 */
var DANGEROUS_TAGS = /(([\<]|[\<][\/])(script|pre|code)([\>]))/gi,
    WHITESPACE = " ";   
/**
 * 
 * @param {string} text 
 * @param {object} linkOptions Optional. Center Link options
 */
function AlertPopup (text, linkOptions) {
    this._htmlInside = text
    this._link = linkOptions
    this.RootElement = null;
    this.BackgroundElement = null;
}
/**
 * 
 * @param {string} ElementTag TagName of element
 * @param {object} Props Props to add to element
 */
AlertPopup.prototype.CreateElement = function (ElementTag, Props) {
    ElementTag = document.createElement(ElementTag);
    for (var Prop in Props) {
        if (Prop === 'attributes') {
            ElementTag.setAttribute(Prop, Props[Prop])
        }
        else {
            ElementTag[Prop] = Props[Prop]
        }
    }
    return ElementTag;
}
/**
 * @return {HTMLDivElement}
 */
AlertPopup.prototype.CreateRootElement = function () {
    return this.CreateElement('div', {className: 'alert-popup--root'});
}
/**
 * @return {HTMLDivElement}
 */
AlertPopup.prototype.CreateBackgroundElement = function () {
    var self = this;
    return this.CreateElement('div', {
        className: "alert-popup--background",
        onclick: function (event) {
            self.RemoveRootElement();
            return true;
        }
    });
}
/**
 * @param {boolean} isHeader Is header needed 
 * @return {HTMLDivElement}
 */
AlertPopup.prototype.CreateBlockElement = function (isHeader) {
    var Block =  this.CreateElement('div', {
        className: 'alert-popup--block'
    });
    var BlockHeader, BlockBody = this.CreateElement('div', {
        className: "alert-popup--block-body",
        innerHTML: this.StripDangerTags(this._htmlInside)
    });

    BlockHeader = isHeader === true? 
        this.CreateElement('div', {
            className: 'alert-popup--block-header'
        }): null;

    if (BlockHeader !== null) {
        this.Append(BlockHeader, this.CreateCloseElement('static'))
            .Append(Block, BlockHeader);
    }
    else {
        this.Append(Block, this.CreateCloseElement('fluent'))
    }
    typeof this._link !== 'undefined'? this.Append(BlockBody, this.CreateCenterLink()): null;

    this.Append(Block, BlockBody);

    return Block;
}
/**
 * 
 * @param {string} ClassNameModifier Modifier for className
 */
AlertPopup.prototype.CreateCloseElement = function (ClassNameModifier) {
    var defaultClassName = 'alert-popup--block-close',
        self = this,
        CloseElement = this.CreateElement('button', {
        className: ClassNameModifier !== null? defaultClassName + WHITESPACE + ClassNameModifier:
            defaultClassName,
        onclick: function (event) {
            self.RemoveRootElement();
            return true;
        },
        innerHTML: "&times;"
    })

    return CloseElement;
}
/**
 * @return {HTMLAnchorElement}
 */
AlertPopup.prototype.CreateCenterLink = function () {
    var Link = this.CreateElement('a', {
        href:  this._link.href || "#",
        innerHTML: this.StripDangerTags(this._link.text || "Ссылка!"),
        className: "alert-popup--block-clink"
    })
    return Link;
}
/**
 * @param {*} parent Parent element
 * @param {*} child Child element to append
 */
AlertPopup.prototype.Append = function (parent, child) {
    typeof parent.appendChild !== 'undefined'? parent.appendChild(child): null;
    return this;
}
/**
 * 
 * @param {string} ___HTML__ HTML Code to correct
 */
AlertPopup.prototype.StripDangerTags = function (__HTML__) {
    return __HTML__.replace(DANGEROUS_TAGS, '').trim();
}
/**
 * @return {boolean}
 */
AlertPopup.prototype.RemoveRootElement = function () {
    this.RootElement.parentNode.removeChild(this.RootElement);
    return true;
}
AlertPopup.prototype.Open = function () {
    this.RootElement = this.CreateRootElement();
    this.Append(this.RootElement, this.CreateBackgroundElement())
        .Append(this.RootElement, this.CreateBlockElement(true));


    this.Append(document.body, this.RootElement)
}
