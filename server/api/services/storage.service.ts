import { Utils } from "../lib/helpers/utils";

import { IStorageRepository } from "../repositories/storage.repository";

import { QueryDTO } from "../dtos/query.dto";
import { StorageDTO } from "../dtos/storage.dto";

export interface IStorageService
    extends Utils.AutoMappedClass<StorageService> {}

export class StorageService implements IStorageService {
    constructor(private storageRepository: IStorageRepository) {}
    public async createAsset(data: StorageDTO.Insert) {
        return this.storageRepository.create(data);
    }
    public async updateAsset(id: string, data: StorageDTO.Update) {
        return this.storageRepository.update(id, data);
    }
    public async getAssetById(id: string) {
        return this.storageRepository.findById(id);
    }
    public async getAssets() {
        return this.storageRepository.findAll();
    }
    public async deleteAsset(id: string) {
        return this.storageRepository.delete(id);
    }
    public async getAssetsByStreamId(
        streamId: string,
        pagination: QueryDTO.Pagination,
    ) {
        return this.storageRepository.findByStreamId(streamId, pagination);
    }

    public async getStorageStats(streamId: string) {
        return this.storageRepository.getStorageStats(streamId);
    }
}
