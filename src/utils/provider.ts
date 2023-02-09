import * as bcrypt from 'bcrypt';
import { join } from 'path';
import * as fs from 'fs';
import { ValidationError } from 'class-validator';
import * as lodash from 'lodash';
import * as moment from 'moment';
import * as numeral from 'numeral';
import { appDataSource } from 'src/config/datasource';
export class UtilsProvider {
  static sortObject(obj) {
    const sorted = {};
    const str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }

  static ConvertNumberInEntites(entity: object) {
    if (entity) {
      for (const item of Object.keys(entity)) {
        if (typeof entity[item] == 'object') {
          entity[item] = UtilsProvider.ConvertNumberInEntites(entity[item]);
        } else {
          if (item.lastIndexOf('id') == item.length - 2) {
            entity[item] = +entity[item];
          }
          if (item.lastIndexOf('count') == item.length - 5) {
            entity[item] = +entity[item];
          }
        }
      }
    }
    return entity;
  }

  static EscapeHtmlBody(object) {
    if (typeof object == 'object') {
      Object.keys(object).forEach((item) => {
        if (typeof object[item] == 'string') {
          object[item] = UtilsProvider.escapeHtml(object[item]);
        }
      });
    }
    if (typeof object == 'string') {
      return UtilsProvider.escapeHtml(object);
    }
    return object;
  }

  static UnEscapeHtmlBody(object) {
    try {
      if (typeof object == 'object') {
        if (object) {
          Object.keys(object).forEach((item) => {
            if (typeof object[item] == 'object') {
              UtilsProvider.UnEscapeHtmlBody(object[item]);
            }
            if (typeof object[item] == 'string') {
              object[item] = UtilsProvider.unescapeHtml(object[item]);
            }
          });
        }
      }
      if (typeof object == 'string') {
        return UtilsProvider.unescapeHtml(object);
      }
      return object;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  static ArrayAnswer(object) {
    try {
      const value = JSON.parse(object);
      if (Array.isArray(value)) return true;
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  static escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // static unescapeHtml(encodedString) {
  //   var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  //   var translate = {
  //     "nbsp": " ",
  //     "amp": "&",
  //     "quot": "\"",
  //     "lt": "<",
  //     "gt": ">"
  //   };
  //   return encodedString.replace(translate_re, function (match, entity) {
  //     return translate[entity];
  //   }).replace(/&#(\d+);/gi, function (match, numStr) {
  //     var num = parseInt(numStr, 10);
  //     return String.fromCharCode(num);
  //   });
  // }

  static unescapeHtml(value) {
    return value
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');
  }

  static parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch {
      throw 'BLOCKING';
    }
  }

  static async cleanAccents(str: string): Promise<string> {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    // Combining Diacritical Marks
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // huyền, sắc, hỏi, ngã, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // mũ â (ê), mũ ă, mũ ơ (ư)
    return str;
  }

  static async titleToSlug(title: string) {
    title = await this.cleanAccents(title);

    return title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  static generateHash(password: string): string {
    return bcrypt.hashSync(password, 12);
  }

  static validateHash(password: string, hash: string): boolean {
    if (!password || !hash) {
      return false;
    }
    return bcrypt.compareSync(password, hash);
  }

  static LocalSavePicture(
    folder: string,
    file: Express.Multer.File,
    filename: string,
  ) {
    try {
      const savepicture = join(folder, filename);
      fs.writeFileSync(savepicture, file.buffer);
      while (!fs.existsSync(savepicture)) {}
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  static arraysAreEqual(ary1, ary2) {
    return ary1.join('') == ary2.join('');
  }

  static getErrorList(validationErrors: ValidationError[], errors: any) {
    for (const e of validationErrors) {
      if (e.children) {
        errors = UtilsProvider.getErrorList(e.children, errors);
      }

      if (!e.constraints) continue;
      const error = {
        property: e.property,
        rule: undefined,
        msg: undefined,
      };
      const rule = lodash.last(Object.keys(e.constraints));
      if (rule == 'isEmail') {
        error.rule = 'email';
      } else if (rule == 'isNotEmpty') {
        error.rule = 'required';
      } else if (rule == 'isNumber' || rule == 'isNumberString') {
        error.rule = 'number';
      } else if (rule.indexOf('is') === 0) {
        error.rule = rule.replace('is', '').toLowerCase();
      } else {
        error.rule = rule;
      }
      errors.push(error);
    }
    return errors;
  }

  static addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static async getSlugName(
    entity_id: any,
    entity_property_id: string,
    class_name: string,
    entity: string,
    slug_property: string,
    // new_slug: string,
    old_title: string,
    new_title: string,
  ) {
    let new_slug = await UtilsProvider.titleToSlug(new_title);
    const QueryRepo = appDataSource.getRepository(class_name);

    let check = true;
    let count = 0;
    const save_check = new_slug;

    while (check) {
      const query = await QueryRepo.createQueryBuilder(entity)
        .where(
          `(${entity}.${slug_property} = :slug and ${
            entity_id ? `${entity}.${entity_property_id} != :id` : '"*"="*"'
          })`,
          {
            slug: new_slug,
            id: entity_id,
          },
        )
        .withDeleted()
        .getCount();
      if (query > 0) {
        new_slug = save_check + '-' + ++count;
      } else {
        check = false;
      }
    }
    return new_slug;
  }

  public static randomNumber(length) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public static randomString(length) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public static getNow() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }

  public static getNowTimeStamp() {
    return moment().unix();
  }

  public static addTwoNumber(num1: number, num2: number) {
    num1 = num1 ? num1 : 0;
    num2 = num2 ? num2 : 0;
    return numeral(num1).add(num2).value();
  }

  public static subtractTwoNumber(num1: number, num2: number) {
    num1 = num1 ? num1 : 0;
    num2 = num2 ? num2 : 0;
    return numeral(num1).subtract(num2).value();
  }

  public static multiplyTwoNumber(num1: number, num2: number) {
    num1 = num1 ? num1 : 0;
    num2 = num2 ? num2 : 0;
    return numeral(num1).multiply(num2).value();
  }

  public static divideTwoNumber(num1: number, num2: number) {
    num1 = num1 ? num1 : 0;
    num2 = num2 ? num2 : 0;
    return numeral(num1).divide(num2).value();
  }
}
