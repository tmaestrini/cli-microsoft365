import assert from 'assert';
import sinon from 'sinon';
import auth from '../../../../Auth.js';
import { cli } from '../../../../cli/cli.js';
import { CommandInfo } from '../../../../cli/CommandInfo.js';
import { Logger } from '../../../../cli/Logger.js';
import { CommandError } from '../../../../Command.js';
import request from '../../../../request.js';
import { telemetry } from '../../../../telemetry.js';
import { formatting } from '../../../../utils/formatting.js';
import { pid } from '../../../../utils/pid.js';
import { session } from '../../../../utils/session.js';
import { sinonUtil } from '../../../../utils/sinonUtil.js';
import commands from '../../commands.js';
import command from './user-app-list.js';
import { settingsNames } from '../../../../settingsNames.js';

describe(commands.USER_APP_LIST, () => {
  const userId = '15d7a78e-fd77-4599-97a5-dbb6372846c6';
  const userName = 'admin@contoso.com';
  const appResponse = {
    "value": [
      {
        "id": "NWM3MDUyODgtZWQ3Zi00NGZjLWFmMGEtYWMxNjQ0MTk5MDFjIyMwOTg5ZjNhNC0yNWY3LTQ2YWItYTNjMC1iY2MwZWNmY2E2ZWY=",
        "teamsAppDefinition": {
          "id": "MzT1NWIxZjktODUwNy00ZjU3LWLmNDktZGI5YXRiNGMyZWRkIyMxLjAuMS4wIyNQpWJsaXNoZDQ=",
          "teamsAppId": "0989f3a4-25f7-46ab-a3c0-bcc0ecfca6ef",
          "displayName": "Whiteboard",
          "version": "1.0.5",
          "publishingState": "published",
          "shortDescription": "Use Microsoft Whiteboard to collaborate, visualize ideas, and work creatively",
          "description": "Create a new whiteboard and collaborate with others in real time.",
          "lastModifiedDateTime": null,
          "createdBy": null
        },
        "teamsApp": {
          "id": "95de633a-083e-42f5-b444-a4295d8e9314",
          "externalId": null,
          "displayName": "Whiteboard",
          "distributionMethod": "store"
        }
      },
      {
        "id": "NWM3MDUyODgtZWQ3Zi00NGZjLWFmMGEtYWMxNjQ0MTk5MDFjIyM5OTlhNTViOS00OTFlLTQ1NGEtODA4Yy1jNzVjNWM3NWZjMGE=",
        "teamsAppDefinition": {
          "id": "MoT1NVIxZjktODUwNy033ZjU3LWLmNDktZGI5YXTiNGMyZWRkIyMxLjAuMS4wIyNQpWJsqXNoZLQ=",
          "teamsAppId": "999a55b9-491e-454a-808c-c75c5c75fc0a",
          "displayName": "Evernote",
          "version": "1.0.1",
          "publishingState": "published",
          "shortDescription": "Capture, organize, and share notes",
          "description": "Unlock the power of teamwork—collect, organize and share the information, documents and ideas you encounter every day.",
          "lastModifiedDateTime": null,
          "createdBy": null
        },
        "teamsApp": {
          "id": "4e1f8576-93d5-4c24-abb5-f02782e00a4e",
          "externalId": null,
          "displayName": "Evernote",
          "distributionMethod": "store"
        }
      }
    ]
  };

  let log: string[];
  let logger: Logger;
  let loggerLogSpy: sinon.SinonSpy;
  let commandInfo: CommandInfo;

  before(() => {
    sinon.stub(auth, 'restoreAuth').resolves();
    sinon.stub(telemetry, 'trackEvent').resolves();
    sinon.stub(pid, 'getProcessName').returns('');
    sinon.stub(session, 'getId').returns('');
    auth.connection.active = true;
    commandInfo = cli.getCommandInfo(command);
  });

  beforeEach(() => {
    log = [];
    logger = {
      log: async (msg: string) => {
        log.push(msg);
      },
      logRaw: async (msg: string) => {
        log.push(msg);
      },
      logToStderr: async (msg: string) => {
        log.push(msg);
      }
    };
    loggerLogSpy = sinon.spy(logger, 'log');
    (command as any).items = [];
  });

  afterEach(() => {
    sinonUtil.restore([
      request.get,
      cli.getSettingWithDefaultValue
    ]);
  });

  after(() => {
    sinon.restore();
    auth.connection.active = false;
  });

  it('has correct name', () => {
    assert.strictEqual(command.name, commands.USER_APP_LIST);
  });

  it('has a description', () => {
    assert.notStrictEqual(command.description, null);
  });

  it('fails validation if the userId is not a valid guid.', async () => {
    const actual = await command.validate({
      options: {
        userId: 'invalid'
      }
    }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if both userId and userName are not provided.', async () => {
    sinon.stub(cli, 'getSettingWithDefaultValue').callsFake((settingName, defaultValue) => {
      if (settingName === settingsNames.prompt) {
        return false;
      }

      return defaultValue;
    });

    const actual = await command.validate({
      options: {
      }
    }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if the userName is not a valid UPN.', async () => {
    const actual = await command.validate({
      options: {
        userName: "no-an-email"
      }
    }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if the both userId and userName are provided.', async () => {
    sinon.stub(cli, 'getSettingWithDefaultValue').callsFake((settingName, defaultValue) => {
      if (settingName === settingsNames.prompt) {
        return false;
      }

      return defaultValue;
    });

    const actual = await command.validate({
      options: {
        userId: userId,
        userName: userName
      }
    }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation when the input is correct (userId)', async () => {
    const actual = await command.validate({
      options: {
        userId: userId
      }
    }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('passes validation when the input is correct (userName)', async () => {
    const actual = await command.validate({
      options: {
        userName: userName
      }
    }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('list apps from the catalog for the specified user using userId', async () => {
    sinon.stub(request, 'get').callsFake(async (opts) => {
      if (opts.url === `https://graph.microsoft.com/v1.0/users/${userId}/teamwork/installedApps?$expand=teamsAppDefinition,teamsApp`) {
        return appResponse;
      }

      throw 'Invalid request';
    });

    await command.action(logger, {
      options: {
        debug: true,
        userId: userId,
        output: 'text'
      }
    } as any);
    assert(loggerLogSpy.calledWith([
      {
        "id": "NWM3MDUyODgtZWQ3Zi00NGZjLWFmMGEtYWMxNjQ0MTk5MDFjIyMwOTg5ZjNhNC0yNWY3LTQ2YWItYTNjMC1iY2MwZWNmY2E2ZWY=",
        "appId": "0989f3a4-25f7-46ab-a3c0-bcc0ecfca6ef",
        "displayName": "Whiteboard",
        "version": "1.0.5"
      },
      {
        "id": "NWM3MDUyODgtZWQ3Zi00NGZjLWFmMGEtYWMxNjQ0MTk5MDFjIyM5OTlhNTViOS00OTFlLTQ1NGEtODA4Yy1jNzVjNWM3NWZjMGE=",
        "appId": "999a55b9-491e-454a-808c-c75c5c75fc0a",
        "displayName": "Evernote",
        "version": "1.0.1"
      }
    ]));
  });

  it('list apps from the catalog for the specified user using userName', async () => {
    sinon.stub(request, 'get').callsFake(async (opts) => {
      if (opts.url === `https://graph.microsoft.com/v1.0/users/${userId}/teamwork/installedApps?$expand=teamsAppDefinition,teamsApp`) {
        return appResponse;
      }

      if (opts.url === `https://graph.microsoft.com/v1.0/users/${formatting.encodeQueryParameter(userName)}/id`) {
        return { "value": userId };
      }

      throw 'Invalid request';
    });

    await command.action(logger, {
      options: {
        userName: userName,
        output: 'text'
      }
    } as any);
    assert(loggerLogSpy.calledWith([
      {
        "id": "NWM3MDUyODgtZWQ3Zi00NGZjLWFmMGEtYWMxNjQ0MTk5MDFjIyMwOTg5ZjNhNC0yNWY3LTQ2YWItYTNjMC1iY2MwZWNmY2E2ZWY=",
        "appId": "0989f3a4-25f7-46ab-a3c0-bcc0ecfca6ef",
        "displayName": "Whiteboard",
        "version": "1.0.5"
      },
      {
        "id": "NWM3MDUyODgtZWQ3Zi00NGZjLWFmMGEtYWMxNjQ0MTk5MDFjIyM5OTlhNTViOS00OTFlLTQ1NGEtODA4Yy1jNzVjNWM3NWZjMGE=",
        "appId": "999a55b9-491e-454a-808c-c75c5c75fc0a",
        "displayName": "Evernote",
        "version": "1.0.1"
      }
    ]));
  });

  it('list apps from the catalog for the specified user (json)', async () => {
    sinon.stub(request, 'get').callsFake(async (opts) => {
      if (opts.url === `https://graph.microsoft.com/v1.0/users/${userId}/teamwork/installedApps?$expand=teamsAppDefinition,teamsApp`) {
        return appResponse;
      }

      throw 'Invalid request';
    });

    await command.action(logger, {
      options: {
        userId: userId,
        output: 'json'
      }
    } as any);
    assert(loggerLogSpy.calledWith(appResponse.value));
  });

  it('correctly handles error while listing teams apps', async () => {
    const error = {
      "error": {
        "code": "UnknownError",
        "message": "An error has occurred",
        "innerError": {
          "date": "2022-02-14T13:27:37",
          "request-id": "77e0ed26-8b57-48d6-a502-aca6211d6e7c",
          "client-request-id": "77e0ed26-8b57-48d6-a502-aca6211d6e7c"
        }
      }
    };

    sinon.stub(request, 'get').rejects(error);

    await assert.rejects(command.action(logger, { options: { userId: '5c705288-ed7f-44fc-af0a-ac164419901c' } } as any), new CommandError('An error has occurred'));
  });
});