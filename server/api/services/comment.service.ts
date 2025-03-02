import { Utils } from "../lib/helpers/utils";

import { ICommentRepository } from "../repositories/comment.repository";

import { CommentDTO } from "../dtos/comment.dto";

export interface ICommentService extends Utils.AutoMappedClass<CommentService> {}

export class CommentService implements ICommentService {
    constructor(private commentRepository: ICommentRepository) {}
    public async createComment(data: CommentDTO.Insert) {
        return this.commentRepository.create(data);
    }
    public async updateComment(id: string, data: CommentDTO.Update) {
        return this.commentRepository.update(id, data);
    }
    public async getCommentById(id: string) {
        return this.commentRepository.findById(id);
    }
    public async getCommentsByUserId(userId: string, offset: number, size: number) {
        return this.commentRepository.findByUserId(userId, offset, size);
    }
    public async getCommentsByVideoId(videoId: string, offset: number, size: number) {
        return this.commentRepository.findByVideoId(videoId, offset, size);
    }
    public async getAllComments() {
        return this.commentRepository.findAll();
    }
    public async deleteComment(id: string) {
        return this.commentRepository.delete(id);
    }
}
