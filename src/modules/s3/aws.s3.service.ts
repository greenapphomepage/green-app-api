import {Injectable} from "@nestjs/common";
import {
    S3Client,
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
    ObjectIdentifier,
    GetObjectCommandInput,
} from '@aws-sdk/client-s3';
import {ConfigService} from "@nestjs/config";
import {Readable} from "stream";

@Injectable()
export class AwsS3Service {
    private readonly s3Client: S3Client;
    private readonly bucket: string;
    private readonly baseUrl: string;
    constructor(private readonly configService: ConfigService) {
        this.s3Client = new S3Client({
            credentials: {
                accessKeyId:
                    this.configService.get<string>('AWS_ID'),
                secretAccessKey: this.configService.get<string>(
                    'AWS_SECRET_KEY'
                ),
            },
            region: this.configService.get<string>('AWS_REGION'),
        });
        this.bucket = this.configService.get<string>('AWS_BUCKET_NAME');
        this.baseUrl = this.configService.get<string>('IMAGE_URL');
    }

    async putItemInBucket(
        filename: string,
        mimetype: string,
        content:
            | string
            | Uint8Array
            | Buffer
            | Readable
            | ReadableStream
            | Blob,
        options?: {
            path: string;
        }
    ): Promise<{
        filename: string,
        completedUrl : string,
        path?: string
    }> {
        let path: string = options && options.path ? options.path : undefined;

        if (path)
            path = path.startsWith('/') ? path.replace('/', '') : `${path}`;

        const mime: string = filename
            .substring(filename.lastIndexOf('.') + 1, filename.length)
            .toUpperCase();
        const key: string = path ? `${path}/${filename}` : filename;
        const command: PutObjectCommand = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: content,
            ContentType: mimetype,
        });

        try {
            await this.s3Client.send(command);
        } catch (err: any) {
            throw err;
        }

        return {
            path,
            filename: filename,
            completedUrl: `${this.baseUrl}/${key}`,
        };
    }

    async getItemInBucket(
        filename: string,
        path?: string
    ): Promise<Record<string, any>> {
        if (path)
            path = path.startsWith('/') ? path.replace('/', '') : `${path}`;

        const key: string = path ? `${path}/${filename}` : filename;
        const input: GetObjectCommandInput = {
            Bucket: this.bucket,
            Key: key,
        };
        const command: GetObjectCommand = new GetObjectCommand(input);

        try {
            const item: Record<string, any> = await this.s3Client.send(command);

            return item.Body;
        } catch (err: any) {
            throw err;
        }
    }
    async deleteItemsInBucket(filenames: string[]): Promise<void> {
        const keys: ObjectIdentifier[] = filenames.map((val) => ({
            Key: val,
        }));
        const command: DeleteObjectsCommand = new DeleteObjectsCommand({
            Bucket: this.bucket,
            Delete: {
                Objects: keys,
            },
        });

        try {
            await this.s3Client.send(command);
            return;
        } catch (err: any) {
            throw err;
        }
    }
    async deleteFolder(dir: string): Promise<void> {
        const commandList: ListObjectsV2Command = new ListObjectsV2Command({
            Bucket: this.bucket,
            Prefix: dir,
        });
        const lists = await this.s3Client.send(commandList);

        try {
            const listItems = lists.Contents.map((val) => ({
                Key: val.Key,
            }));
            const commandDeleteItems: DeleteObjectsCommand =
                new DeleteObjectsCommand({
                    Bucket: this.bucket,
                    Delete: {
                        Objects: listItems,
                    },
                });

            await this.s3Client.send(commandDeleteItems);

            const commandDelete: DeleteObjectCommand = new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: dir,
            });
            await this.s3Client.send(commandDelete);

            return;
        } catch (err: any) {
            throw err;
        }
    }
}