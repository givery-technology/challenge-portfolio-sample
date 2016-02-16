'use strict';

var Project = (function () {
  function isEmpty (val) {
    if (Array.isArray(val)) {
      return val.every(isEmpty);
    }

    if (val === undefined || val === null) {
      return true;
    } else {
      return false;
    }
  };

  function Project (id, title, description, url, imageUrl, createdAt) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._url = url;
    this._imageUrl = imageUrl,
    this._createdAt = createdAt;
  }
  Project.prototype.id = function id (val) {
    if (isEmpty(val)) {
      return this._id;
    } else {
      this._id = val;
      return this;
    }
  };
  Project.prototype.title = function title (val) {
    if (isEmpty(val)) {
      return this._title;
    } else {
      this._title = val;
      return this;
    }
  };
  Project.prototype.description = function description (val) {
    if (isEmpty(val)) {
      return this._description;
    } else {
      this._description = val;
      return this;
    }
  };
  Project.prototype.url = function url (val) {
    if (isEmpty(val)) {
      return this._url;
    } else {
      this._url = val;
      return this;
    }
  };
  Project.prototype.imageUrl = function imageUrl (val) {
    if (isEmpty(val)) {
      return this._imageUrl;
    } else {
      this._imageUrl = imageUrl;
      return this;
    }
  };
  Project.prototype.createdAt = function createdAt (val) {
    if (isEmpty(val)) {
      return this._createdAt;
    } else {
      this._createdAt = val;
      return this;
    }
  };

  Project.prototype.toJson = function toJson () {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      url: this._url,
      imageUrl: this._imageUrl,
      created_at: this._createdAt
    };
  };

  Project.prototype.canSave = function canSave () {
    if (isEmpty([this._title, this._description])) {
      return false;
    } else {
      return true;
    }
  };

  return Project;
})();

module.exports = Project;
