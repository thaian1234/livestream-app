import { Utils } from "../lib/helpers/utils";

import { IStorageRepository } from "../repositories/storage.repository";
import { IVideoRepository } from "../repositories/video.repository";

import { StorageDTO } from "../dtos/storage.dto";
import { VideoDTO } from "../dtos/video.dto";

export interface IStorageService
    extends Utils.AutoMappedClass<StorageService> {}

export class StorageService implements IStorageService {
    constructor(private storageRepository: IStorageRepository) {}
    public async createAsset(data: StorageDTO.Insert) {
        return this.storageRepository.create(data);
    }
    public async updateStorage(id: string, data: StorageDTO.Update) {
        return this.storageRepository.update(id, data);
    }
    public async getStorageById(id: string) {
        return this.storageRepository.findById(id);
    }
    public async getAllStorages() {
        return this.storageRepository.findAll();
    }
    public async deleteStorage(id: string) {
        return this.storageRepository.delete(id);
    }
}
