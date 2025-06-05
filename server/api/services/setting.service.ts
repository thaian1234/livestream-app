import { Utils } from "../lib/helpers/utils";

import { ISettingRepository } from "../repositories/setting.repository";

import { SettingDTO } from "../dtos/setting.dto";

export interface ISettingService
    extends Utils.AutoMappedClass<SettingService> {}

export class SettingService implements ISettingService {
    constructor(private readonly settingRepository: ISettingRepository) {}
    public async createOne(data: SettingDTO.Insert) {
        return this.settingRepository.createOne(data);
    }
    public async upsertByStreamId(streamId: string, data: SettingDTO.Update) {
        return this.settingRepository.upsertByStreamId(streamId, data);
    }
    public async getSettingByStreamId(streamId: string) {
        return this.settingRepository.getSettingByStreamId(streamId);
    }
}
