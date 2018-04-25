import * as fs from "fs";
import FileMimes from '../config/FileMimes';

export default class FileService {

  static isValidContentTypeForFileType(contentType: String, type: String): Boolean {
    if (FileMimes[type].indexOf(contentType) != -1) return true;
    return false;
  }

  static process(file: String, type: String) {
    // The content type of file
    const contentType = file.split(';')[0].split(':')[1];
    if (!contentType) throw new Error("Invalid file.");

    if (!FileService.isValidContentTypeForFileType(contentType, type)) {
      throw new Error(`Invalid ${type} type ${contentType}`);
    }

    // Create the buffer from file by removing the base64 part
    const fileBuffer = Buffer.from(file.split("base64,")[1], "base64");

    // Extension of the file
    const extensions = file.split('/')[1].split(';')[0].split('.');

    return {
      contentType,
      fileBuffer,
      extension: extensions[extensions.length - 1]
    }
  }
}