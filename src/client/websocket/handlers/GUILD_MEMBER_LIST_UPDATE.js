'use strict';

module.exports = (client, { d: data }, shard) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (guild) {
    data.ops.forEach(op => {
      switch (op.op) {
        case 'INSERT':
        case 'UPDATE':
          if (op.item.member) {
            client.actions.GuildMemberUpdate.handle({ ...op.item.member, guild_id: data.guild_id }, shard);
            if (op.item.member.presence) {
              client.actions.PresenceUpdate.handle({ ...op.item.member.presence, guild_id: data.guild_id });
            }
          }
          break;
        case 'SYNC':
          if (op.items) {
            op.items.forEach(item => {
              if (item.member) {
                client.actions.GuildMemberUpdate.handle({ ...item.member, guild_id: data.guild_id }, shard);
                if (item.member.presence) {
                  client.actions.PresenceUpdate.handle({ ...item.member.presence, guild_id: data.guild_id });
                }
              }
            });
          }
      }
    });
  }
};
