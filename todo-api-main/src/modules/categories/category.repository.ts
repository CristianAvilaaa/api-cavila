import { getDb } from "../../config/database";
import { Category } from "./category.model";
import { Collection, ObjectId } from "mongodb";

export class CategoryRepository {

    private collection(): Collection<Category> {
        return getDb().collection<Category>("Category");
    }

    async create(data: Category): Promise<Category> {
        const result = await this.collection().insertOne(data as Category);
        return { _id: result.insertedId, ...data };
    }

    async delete(id: ObjectId): Promise<boolean> {
        const result = await this.collection().deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
    async update(id: ObjectId, changes: Partial<Category>): Promise<Category | null> {
        const result = await this.collection().findOneAndUpdate(
            { _id: id },
            { $set: changes },
            { returnDocument: "after" }
        );
        return result ?? null;
    }

    async findAll(): Promise<Category[]> {
        return this.collection().find().sort({ createdAt: -1 }).toArray();
    }

    async findById(id: ObjectId): Promise<Category | null> {
        return this.collection().findOne({ _id: id });
    }
}
