import { PubSub } from "graphql-subscriptions";
const pubsub = new PubSub();

class services {
  static publishEvent = async (eventName, eventData) => {
    return await pubsub.publish(eventName, { userAdded: eventData });
  };

  static getDataEvent = async (eventName) => {
    return pubsub.asyncIterator(eventName);
  };
}

export default services;
