import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { createFactory } from "hono/factory";
import { logger } from "hono/logger";

import { AppConfig } from "../configs/app.config";

import { HttpStatus } from "../lib/constant/http.type";
import { ApiResponse } from "../lib/helpers/api-response";
import { Env } from "../lib/types/factory.type";
import { Validator } from "../lib/validations/validator";

import { AuthMiddleware } from "../middleware/auth.middleware";

import { AccountRepository } from "../repositories/account.repository";
import { BlockRepository } from "../repositories/block.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { CommentRepository } from "../repositories/comment.repository";
import { DonateCardRepository } from "../repositories/donate-card.repository";
import { EmailVerificationRepository } from "../repositories/email-verification.repository";
import { EventRepository } from "../repositories/event.repository";
import { FollowRepository } from "../repositories/follow.repository";
import { ForgetPasswordRepository } from "../repositories/forget-password.repository";
import { OrderRepository } from "../repositories/order.repository";
import { SettingRepository } from "../repositories/setting.repository";
import { StorageRepository } from "../repositories/storage.repository";
import { StreamRepository } from "../repositories/stream.repository";
import { UserRepository } from "../repositories/user.repository";
import { VideoLikeRepository } from "../repositories/video-like.repository";
import { VideoRepository } from "../repositories/video.repository";
import { WalletTransactionRepository } from "../repositories/wallet-transaction.repository";
import { WalletRepository } from "../repositories/wallet.repository";

import { AuthService } from "../services/auth.service";
import { BlockService } from "../services/block.service";
import { CategoryService } from "../services/category.service";
import { CommentService } from "../services/comment.service";
import { DonateCardService } from "../services/donate-card.service";
import { DonationService } from "../services/donation.service";
import { EmailVerificationService } from "../services/email-verification.service";
import { EventService } from "../services/event.service";
import { FollowService } from "../services/follow.service";
import { ForgetPasswordService } from "../services/forget-password.service";
import { PaymentProcessorFactory } from "../services/payment/payment-processor-factory";
import { VNPayProcessor } from "../services/payment/vnpay-processor";
import { SettingService } from "../services/setting.service";
import { StorageService } from "../services/storage.service";
import { StreamService } from "../services/stream.service";
import { UserService } from "../services/user.service";
import { VideoLikeService } from "../services/video-like.service";
import { VideoService } from "../services/video.service";
import { WalletService } from "../services/wallet.service";

import { AIServiceBuilder } from "../external-services/ai.service";
import { GetStreamService } from "../external-services/getstream.service";
import { GitHubService } from "../external-services/github.service";
import { GoogleService } from "../external-services/google.service";
import { NodemailService } from "../external-services/nodemail.service";
import { NotificationService } from "../external-services/notification.service";
import { R2BucketService } from "../external-services/r2-bucket.service";
import { VNPayService } from "../external-services/vnpay.service";

import { AuthController } from "../controllers/auth.controller";
import { BlockController } from "../controllers/block.controller";
import { CategoryController } from "../controllers/category.controller";
import { CommentController } from "../controllers/comment.controller";
import { DonationController } from "../controllers/donation.controller";
import { EventController } from "../controllers/event.controller";
import { FollowController } from "../controllers/follow.controller";
import { NotificationController } from "../controllers/notification.controller";
import { OauthController } from "../controllers/oauth.controller";
import { SearchController } from "../controllers/search.controller";
import { SettingController } from "../controllers/setting.controller";
import { StorageController } from "../controllers/storage.controller";
import { StreamController } from "../controllers/stream.controller";
import { UploadController } from "../controllers/upload.controller";
import { UserController } from "../controllers/user.controller";
import { VideoLikeController } from "../controllers/video-like.controller";
import { VideoController } from "../controllers/video.controller";
import { WebhookController } from "../controllers/webhook.controller";

import { AuthRoutes } from "../routes/auth.routes";
import { BlockRoutes } from "../routes/block.routes";
import { CategoryRoutes } from "../routes/category.routes";
import { CommentRoutes } from "../routes/comment.routes";
import { DonationRoutes } from "../routes/donation.routes";
import { EventRoutes } from "../routes/event.routes";
import { FollowRoutes } from "../routes/follow.routes";
import { NotificationRoutes } from "../routes/notification.routes";
import { SearchRoutes } from "../routes/search.routes";
import { SettingRoutes } from "../routes/setting.routes";
import { StorageRoutes } from "../routes/storage.routes";
import { StreamRoutes } from "../routes/stream.routes";
import { UploadRoutes } from "../routes/upload.routes";
import { UserRoutes } from "../routes/user.routes";
import { VideoLikeRoutes } from "../routes/video-like.routes";
import { VideoRoutes } from "../routes/video.routes";
import { WebhookRoutes } from "../routes/webhook.routes";

export class App {
    constructor(private readonly app: Hono) {
        this.setupMiddleware();
        this.setupErrorHandling();
        this.setupRoutes();
    }

    private setupMiddleware(): void {
        this.app.use(logger());
        this.app.use(csrf());
        this.app.use("*", cors(AppConfig.CORS_OPTIONS));
        this.app.use("*", AuthMiddleware.init);
    }

    private setupErrorHandling(): void {
        this.app.onError(Validator.handleErrorException);
        this.app.notFound((c) =>
            ApiResponse.WriteErrorJSON({
                c,
                status: HttpStatus.NotFound,
                msg: "API not found",
            }),
        );
    }

    private setupRoutes() {
        const factory = createFactory<Env>();

        // Repositories
        const userRepository = new UserRepository();
        const followRepository = new FollowRepository();
        const blockRepository = new BlockRepository();
        const streamRepository = new StreamRepository();
        const settingRepository = new SettingRepository();
        const accountRepository = new AccountRepository();
        const categoryRepository = new CategoryRepository();
        const emailVerificationRepository = new EmailVerificationRepository();
        const forgetPasswordRepository = new ForgetPasswordRepository();
        const videoRepository = new VideoRepository();
        const storageRepository = new StorageRepository();
        const videolikeRepository = new VideoLikeRepository();
        const commentRepository = new CommentRepository();
        const eventRepository = new EventRepository();
        const donateCardRepository = new DonateCardRepository();
        const orderRepository = new OrderRepository();
        const walletRepository = new WalletRepository();
        const walletTransactionRepository = new WalletTransactionRepository();

        // Services
        const userService = new UserService(userRepository);
        const blockService = new BlockService(blockRepository);
        const followService = new FollowService(followRepository, blockService);
        const streamService = new StreamService(streamRepository);
        const settingService = new SettingService(settingRepository);
        const notificationService = new NotificationService();
        const r2BucketService = new R2BucketService();
        const getstreamService = new GetStreamService();
        const authService = new AuthService(userService, getstreamService);
        const emailVerificationService = new EmailVerificationService(
            emailVerificationRepository,
        );
        const nodemailService = new NodemailService();
        const forgetPasswordService = new ForgetPasswordService(
            forgetPasswordRepository,
        );
        const googleService = new GoogleService(
            accountRepository,
            userService,
            getstreamService,
            streamService,
        );
        const githubService = new GitHubService(
            accountRepository,
            userService,
            getstreamService,
            streamService,
        );
        const categoryService = new CategoryService(categoryRepository);
        const videoService = new VideoService(videoRepository);
        const storageService = new StorageService(storageRepository);
        const videolikeService = new VideoLikeService(videolikeRepository);
        const commentService = new CommentService(commentRepository);
        const aiServiceBuilder = new AIServiceBuilder();
        const eventService = new EventService(eventRepository, userService);
        const donateCardService = new DonateCardService(donateCardRepository);
        const walletService = new WalletService(
            walletRepository,
            walletTransactionRepository,
        );
        const vnpayService = new VNPayService();
        const vnpayProcessor = new VNPayProcessor(
            vnpayService,
            userRepository,
            orderRepository,
            walletService,
            streamRepository,
        );
        const paymentProcessorFactory = new PaymentProcessorFactory(
            vnpayProcessor,
        );
        const donationService = new DonationService(
            paymentProcessorFactory,
            userRepository,
            notificationService,
        );

        // Controllers
        const userController = new UserController(
            factory,
            userService,
            followService,
            streamService,
            settingService,
        );
        const followController = new FollowController(
            factory,
            followService,
            notificationService,
        );
        const authController = new AuthController(
            factory,
            authService,
            userService,
            emailVerificationService,
            nodemailService,
            getstreamService,
            streamService,
            forgetPasswordService,
        );
        const oauthController = new OauthController(
            factory,
            googleService,
            githubService,
        );
        const uploadController = new UploadController(
            factory,
            r2BucketService,
            userService,
            streamService,
            videoService,
            storageService,
        );
        const blockController = new BlockController(
            factory,
            blockService,
            notificationService,
        );
        const searchController = new SearchController(
            factory,
            userService,
            streamService,
        );
        const streamController = new StreamController(
            factory,
            streamService,
            getstreamService,
            settingService,
            categoryService,
            followRepository,
            notificationService,
            aiServiceBuilder,
        );
        const settingController = new SettingController(
            factory,
            settingService,
            getstreamService,
        );
        const categoryController = new CategoryController(
            factory,
            categoryService,
        );
        const notificationController = new NotificationController(
            factory,
            notificationService,
        );
        const videoController = new VideoController(
            factory,
            videoService,
            aiServiceBuilder,
            categoryService,
            followService,
            r2BucketService,
        );
        const webhookController = new WebhookController(
            factory,
            getstreamService,
            storageService,
        );
        const storageController = new StorageController(
            factory,
            storageService,
        );
        const videoLikeController = new VideoLikeController(
            factory,
            videolikeService,
            videoService,
        );
        const commentController = new CommentController(
            factory,
            commentService,
        );
        const eventController = new EventController(factory, eventService);
        const donationController = new DonationController(
            factory,
            donationService,
            donateCardService,
        );

        // Routes
        const userRoutes = new UserRoutes(factory, userController);
        const followRoutes = new FollowRoutes(factory, followController);
        const authRoutes = new AuthRoutes(
            factory,
            authController,
            oauthController,
        );
        const uploadRoutes = new UploadRoutes(factory, uploadController);
        const blockRoutes = new BlockRoutes(factory, blockController);
        const searchRoutes = new SearchRoutes(factory, searchController);
        const streamRoutes = new StreamRoutes(factory, streamController);
        const settingRoutes = new SettingRoutes(factory, settingController);
        const categoryRoutes = new CategoryRoutes(factory, categoryController);
        const notificationRoutes = new NotificationRoutes(
            factory,
            notificationController,
        );
        const videoRoutes = new VideoRoutes(factory, videoController);
        const webhookRoutes = new WebhookRoutes(factory, webhookController);
        const storageRoutes = new StorageRoutes(factory, storageController);
        const videolikeRoutes = new VideoLikeRoutes(
            factory,
            videoLikeController,
        );
        const commentRoutes = new CommentRoutes(factory, commentController);
        const eventRoutes = new EventRoutes(factory, eventController);
        const donationRoutes = new DonationRoutes(factory, donationController);

        return this.app
            .basePath(AppConfig.BASE_PATH)
            .route("/", userRoutes.setupRoutes())
            .route("/", followRoutes.setupRoutes())
            .route("/", authRoutes.setupRoutes())
            .route("/", uploadRoutes.setupRoutes())
            .route("/", blockRoutes.setupRoutes())
            .route("/", searchRoutes.setupRoutes())
            .route("/", streamRoutes.setupRoutes())
            .route("/", settingRoutes.setupRoutes())
            .route("/", categoryRoutes.setupRoutes())
            .route("/", notificationRoutes.setupRoutes())
            .route("/", videoRoutes.setupRoutes())
            .route("/", webhookRoutes.setupRoutes())
            .route("/", storageRoutes.setupRoutes())
            .route("/", eventRoutes.setupRoutes())
            .route("/", videolikeRoutes.setupRoutes())
            .route("/", commentRoutes.setupRoutes())
            .route("/", donationRoutes.setupRoutes());
    }
}
