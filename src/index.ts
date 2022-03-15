import "dotenv/config";
import {
  Storage,
  StorageOptions,
  GetBucketsResponse,
  GetSignedUrlResponse,
} from "@google-cloud/storage";

enum Actions {
  read = "read",
  write = "write",
}

class StorageBucket {
  private storage: Storage;
  private bucketname: string;

  constructor(bucketname: string, opts: StorageOptions) {
    this.bucketname = bucketname;
    this.storage = new Storage(opts);
  }

  public async createBucket(bucketName: string): Promise<void> {
    try {
      await this.storage.createBucket(bucketName);
      console.log(`Bucket ${bucketName} created.`);
    } catch (err) {
      throw err;
    }
  }

  public async getAllBuckets(): Promise<GetBucketsResponse> {
    try {
      return await this.storage.getBuckets();
    } catch (err) {
      throw err;
    }
  }

  public async signedUrl(filename: string): Promise<GetSignedUrlResponse> {
    return await this.storage
      .bucket(this.bucketname)
      .file(filename)
      .getSignedUrl({
        version: "v4",
        action: Actions.write,
        expires: Date.now() + 15 * 60 * 1000,
      });
  }
}

const run = async () => {
  const storage = new StorageBucket("bcuketname", {
    projectId: process.env.PROJECT_ID,
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY,
      client_id: process.env.CLIENT_ID,
      token_url: process.env.TOKEN_URI,
    },
  });

  const [url] = await storage.signedUrl("myfilexxx");
  console.log("----", url);
};

run();
