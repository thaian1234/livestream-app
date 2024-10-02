import { SettingDTO } from "../dtos/setting.dto";
import { Utils } from "../lib/helpers/utils";
import { ISettingRepository } from "../repositories/setting.repository";

export interface ISettingService
    extends Utils.AutoMappedClass<SettingService> {}

export class SettingService implements ISettingService {
    constructor(private readonly settingRepository: ISettingRepository) {}
    public async createOne(data: SettingDTO.Insert) {
        return this.settingRepository.createOne(data);
    }
    public async updateByStreamId(streamId: string, data: SettingDTO.Update) {
        return this.settingRepository.updateByStreamId(streamId, data);
    }
}
