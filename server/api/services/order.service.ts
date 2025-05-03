import { Utils } from "../lib/helpers/utils";

import { IOrderRepository } from "../repositories/order.repository";

import { OrderDTO } from "../dtos/order.dto";

export interface IOrderService extends Utils.AutoMappedClass<OrderService> {}

export class OrderService implements IOrderService {
    constructor(private orderRepository: IOrderRepository) {}

    public async createOrder(data: OrderDTO.Insert) {
        return await this.orderRepository.create(data);
    }

    public async getOrderById(id: string) {
        return await this.orderRepository.findById(id);
    }

    public async getUserOrders(userId: string, page = 1, size = 10) {
        return await this.orderRepository.findByUserId(userId, page, size);
    }

    public async getStreamOrders(streamId: string, page = 1, size = 10) {
        return await this.orderRepository.findByStreamId(streamId, page, size);
    }

    public async updateOrder(id: string, data: OrderDTO.Update) {
        return await this.orderRepository.update(id, data);
    }

    public async getDonationStats(streamId: string, period = "all") {
        return await this.orderRepository.getDonationStatsByStreamId(
            streamId,
            period,
        );
    }
}
