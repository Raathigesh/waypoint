import { Message } from "./Message";
import { Resolver, Mutation, Arg, Subscription, Root } from "type-graphql";
import { Events, MessageEvent } from "./Events";
import { pubSub } from "common/pubSub";

@Resolver(Message)
export default class MessageResolver {
  @Mutation(returns => Number)
  sendToExtension(@Arg("id") id: string, @Arg("payload") payload: string) {
    pubSub.publish(Events.MESSAGE_TO_EXTENSION, {
      id,
      payload
    });
    return 0;
  }

  @Mutation(returns => Number)
  sendToClient(@Arg("id") id: string, @Arg("payload") payload: string) {
    pubSub.publish(Events.MESSAGE_TO_CLIENT, {
      id,
      payload
    });
    return 0;
  }

  @Subscription(returns => Message, {
    topics: [Events.MESSAGE_TO_CLIENT]
  })
  listenToClientMessages(@Root() event: MessageEvent) {
    const message = new Message();
    message.id = event.id;
    message.payload = event.payload;
    return message;
  }

  @Subscription(returns => Message, {
    topics: [Events.MESSAGE_TO_EXTENSION]
  })
  listenToExtensionMessages(@Root() event: MessageEvent) {
    const message = new Message();
    message.id = event.id;
    message.payload = event.payload;
    return message;
  }
}
