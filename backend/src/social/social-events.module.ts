import { Module } from "@nestjs/common";
import { SocialEventsService } from "./social-events.service";

@Module({
    providers: [SocialEventsService],
    exports: [SocialEventsService],
})
export class SocialEventsModule {}
