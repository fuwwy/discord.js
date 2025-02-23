'use strict';

const ClientApplication = require('../../../structures/ClientApplication');
let ClientUser;

module.exports = (client, { d: data }, shard) => {
  if (client.user) {
    client.user._patch(data.user);
  } else {
    if (!ClientUser) ClientUser = require('../../../structures/ClientUser');
    client.user = new ClientUser(client, data.user);
    client.users.cache.set(client.user.id, client.user);
  }

  for (const guild of data.guilds) {
    guild.shardId = shard.id;
    client.guilds._add(guild);
    shard.expectedGuilds.delete(guild.id);
  }

  if (client.application) {
    client.application._patch(data.application);
  } else if (data.application) {
    client.application = new ClientApplication(client, data.application);
  }

  shard.checkReady();
};
