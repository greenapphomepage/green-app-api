import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
@EventSubscriber()
export class mySubscriber implements EntitySubscriberInterface {
  async beforeInsert(event: InsertEvent<any>) {
    if (
      (await event.manager.query(`Select @@time_zone`))[0]['@@time_zone'] !=
      '+00:00'
    ) {
      if (event.entity) {
        if (event.metadata.createDateColumn) {
          event.entity[event.metadata.createDateColumn.databaseName] =
            new Date();
        }
        if (event.metadata.updateDateColumn) {
          event.entity[event.metadata.updateDateColumn.databaseName] =
            new Date();
        }
      }
    }
  }

  async beforeUpdate(event: UpdateEvent<any>) {
    if (
      (await event.manager.query(`Select @@time_zone`))[0]['@@time_zone'] !=
      '+00:00'
    ) {
      if (event.entity) {
        if (event.metadata.updateDateColumn) {
          event.entity[event.metadata.updateDateColumn.databaseName] =
            new Date();
        }
      }
    }
  }

  beforeRemove(event: RemoveEvent<any>) {
    event.manager.query(`SET time_zone = '+00:00';`);
  }
}
