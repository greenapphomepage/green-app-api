import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit-table';
import { Injectable } from '@nestjs/common';
import { PlatformEnum } from '../enum/platform.enum';

@Injectable()
export class CreateTable {
  static async create(
    listOption?: {
      type: string;
      nameOption: string;
      price: number;
    }[],
    totalPrice?: number,
    tableName?: string,
    platform?: PlatformEnum,
  ) {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    // file name
    const output = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'table',
      `${tableName}.pdf`,
    );
    doc.pipe(fs.createWriteStream(output));

    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    const newDate = year + '-' + month + '-' + day;
    doc.fontSize(24);
    const table = {
      headers: [
        {
          label: '날짜',
          property: '날짜',
          renderer: null,
          valign: 'center',
          color: '#FFFFFF',
          headerColor: '#000000',
          align: 'center',
        },
        {
          label: '수신',
          property: '수신',
          renderer: null,
          valign: 'center',
          color: '#FFFFFF',
          headerColor: '#000000',
          align: 'center',
        },
        {
          label: '유효기한',
          property: '유효기한',
          renderer: null,
          valign: 'center',
          color: '#FFFFFF',
          headerColor: '#000000',
          align: 'center',
        },
      ],
      rows: [[newDate, '[이승우]님 귀하', '견적일로부터 30일']],
    };

    const image = path.join(__dirname, '..', '..', 'assets', 'moc.png');

    const tableInfomation = {
      headers: [
        {
          label: '사업자번호 ',
          property: '사업자번호 ',
          renderer: null,
          valign: 'center',
          color: '#FFFFFF',
          headerColor: '#000000',
          align: 'center',
        },
        {
          label: '상호',
          property: '상호',
          renderer: null,
          valign: 'center',
          headerColor: '#000000',
          align: 'center',
        },
        {
          label: '주소',
          property: '주소',
          renderer: null,
          valign: 'center',
          headerColor: '#000000',
          align: 'center',
        },
        {
          label: '날인',
          property: '날인',
          headerColor: '#000000',
          align: 'center',
          valign: 'center',
          renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => {
            const { x, y, width, height } = rectCell;
            doc.image(image, x + width / 4, y + height / 4, {
              fit: [width / 2, height / 2],
              align: 'center',
              valign: 'center',
            });
            return '';
          },
        },
      ],
      rows: [
        [
          '362-81-00644',
          '(주)인썸니아',
          '서울시 성동구 성수일로 19 유한타워 4층',
          '',
        ],
      ],
    };
    const boldPath = path.join(
      __dirname,
      '..',
      '..',
      'assets',
      'NanumGothic-Bold.ttf',
    );
    const extraBoldPath = path.join(
      __dirname,
      '..',
      '..',
      'assets',
      'NanumGothic-ExtraBold.ttf',
    );
    const regularPath = path.join(
      __dirname,
      '..',
      '..',
      'assets',
      'NanumGothic-Regular.ttf',
    );

    const listRowOption = [];
    listOption.forEach((item) => {
      listRowOption.push([item.type, item.nameOption, `${item.price}만 원`]);
    });

    //table option
    const tableOption = {
      headers: [
        {
          label: '항목명',
          property: '항목명',
          renderer: null,
          valign: 'center',
          color: '#FFFFFF',
          headerColor: '#000000',
          align: 'center',
        },
        {
          label: '설명',
          property: '설명',
          renderer: null,
          valign: 'center',
          headerColor: '#000000',
          align: 'center',
        },
        {
          label: '개발비용',
          property: '개발비용',
          renderer: null,
          valign: 'center',
          headerColor: '#000000',
          align: 'center',
        },
      ],
      rows: listRowOption,
    };
    //table platform
    let newPlatform = '사용 불가';
    if (platform) {
      if (platform === PlatformEnum.MOBILE_APP) {
        newPlatform = '모발일앱';
      }
      if (platform === PlatformEnum.WEB_APP) {
        newPlatform = '반응형웹';
      }
      if (platform === PlatformEnum.BOTH) {
        newPlatform = '모발일앱그리고반응형웹';
      }
    }
    const tablePlatform = {
      headers: [
        {
          label: '기술 구성 항목',
          property: '기술 구성 항목',
          renderer: null,
          valign: 'center',
          color: '#FFFFFF',
          headerColor: '#000000',
          align: 'center',
        },
        {
          label: '세부 사양',
          property: '세부 사양',
          renderer: null,
          valign: 'center',
          headerColor: '#000000',
          align: 'center',
        },
      ],
      rows: [
        ['개발 언어/프레임워크', platform ? platform : '루비'],
        ['웹 서버', 'Nginx'],
        ['데이터베이스', 'Mysql'],
        ['배포 OS', 'Ubuntu 20.04'],
      ],
    };

    //table price
    const tablePrice = {
      headers: [
        {
          label: '개발기간',
          property: '개발기간',
          renderer: null,
          valign: 'center',
          color: '#FFFFFF',
          headerColor: '#000000',
          align: 'center',
        },
        {
          label: '견적가',
          property: '견적가',
          renderer: null,
          valign: 'center',
          headerColor: '#000000',
          align: 'center',
        },
      ],
      rows: [
        [
          '7개월',
          totalPrice ? `${totalPrice}(부가세 별도)` : '66,000,000(부가세 별도)',
        ],
      ],
    };
    await doc.table(table, {
      prepareHeader: () => doc.font(boldPath).fontSize(13),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        return doc.font(regularPath).fontSize(10);
        // indexColumn === 0 && doc.addBackground(rectRow, "blue", 0.15);
      },
      title: {
        label: '견 적 서',
        fontSize: 20,
        color: 'black',
        fontFamily: extraBoldPath,
      },
      // A4 595.28 x 841.89 (portrait) (about width sizes)
      width: 535.28,
      //columnsSize: [ 200, 100, 100 ],
    });
    await doc.table(tableInfomation, {
      prepareHeader: () => doc.font(boldPath).fontSize(13),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        return doc.font(regularPath).fontSize(10);
        // indexColumn === 0 && doc.addBackground(rectRow, "blue", 0.15);
      },
      title: {
        label: '공급자',
        fontSize: 20,
        color: 'black',
        fontFamily: extraBoldPath,
      },
      // A4 595.28 x 841.89 (portrait) (about width sizes)
      width: 535.28,
      minRowHeight: 100,
      //   columnsSize: [200, 100, 100],
    });
    await doc.table(tableOption, {
      prepareHeader: () => doc.font(boldPath).fontSize(13),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        return doc.font(regularPath).fontSize(10);
        // indexColumn === 0 && doc.addBackground(rectRow, "blue", 0.15);
      },
      title: {
        label: '견적 상세 항목 기준',
        fontSize: 20,
        color: 'black',
        fontFamily: extraBoldPath,
      },
      // A4 595.28 x 841.89 (portrait) (about width sizes)
      width: 535.28,
      columnsSize: [120, 295.28, 120],
    });
    await doc.table(tablePlatform, {
      prepareHeader: () => doc.font(boldPath).fontSize(13),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        return doc.font(regularPath).fontSize(10);
        // indexColumn === 0 && doc.addBackground(rectRow, "blue", 0.15);
      },
      title: {
        label: '개발 기술',
        fontSize: 20,
        color: 'black',
        fontFamily: extraBoldPath,
      },
      width: 535.28,
      columnsSize: [150, 385.28],
    });

    await doc.table(tablePrice, {
      prepareHeader: () => doc.font(boldPath).fontSize(13),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        return doc.font(regularPath).fontSize(10);
      },
      title: {
        label: '견적 안내',
        fontSize: 20,
        color: 'black',
        fontFamily: extraBoldPath,
      },
      width: 535.28,
      columnsSize: [150, 385.28],
    });

    // done!
    doc.end();
  }
}
