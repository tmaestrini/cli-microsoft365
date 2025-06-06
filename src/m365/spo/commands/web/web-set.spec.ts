import assert from 'assert';
import sinon from 'sinon';
import auth from '../../../../Auth.js';
import { cli } from '../../../../cli/cli.js';
import { CommandInfo } from '../../../../cli/CommandInfo.js';
import { Logger } from '../../../../cli/Logger.js';
import { CommandError } from '../../../../Command.js';
import request from '../../../../request.js';
import { telemetry } from '../../../../telemetry.js';
import { pid } from '../../../../utils/pid.js';
import { session } from '../../../../utils/session.js';
import { sinonUtil } from '../../../../utils/sinonUtil.js';
import commands from '../../commands.js';
import command from './web-set.js';

describe(commands.WEB_SET, () => {
  let log: string[];
  let logger: Logger;
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
  });

  afterEach(() => {
    sinonUtil.restore([
      request.patch
    ]);
  });

  after(() => {
    sinon.restore();
    auth.connection.active = false;
  });

  it('has correct name', () => {
    assert.strictEqual(command.name, commands.WEB_SET);
  });

  it('has a description', () => {
    assert.notStrictEqual(command.description, null);
  });

  it('updates site title', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        Title: 'New title'
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', title: 'New title' } });
  });

  it('updates site logo URL', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        SiteLogoUrl: 'image.png'
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', siteLogoUrl: 'image.png' } });
  });

  it('unsets the site logo', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        SiteLogoUrl: ''
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', siteLogoUrl: '' } });
  });

  it('disables quick launch', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        QuickLaunchEnabled: false
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', quickLaunchEnabled: false } });
  });

  it('enables quick launch', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        QuickLaunchEnabled: true
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', quickLaunchEnabled: true } });
  });

  it('sets site header to compact', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        HeaderLayout: 2
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', headerLayout: 'compact' } });
  });

  it('sets site header to standard', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        HeaderLayout: 1
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', headerLayout: 'standard' } });
  });

  it('sets site header emphasis to 0', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        HeaderEmphasis: 0
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', headerEmphasis: 0 } });
  });

  it('sets site header emphasis to 1', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        HeaderEmphasis: 1
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', headerEmphasis: 1 } });
  });

  it('sets site header emphasis to 2', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        HeaderEmphasis: 2
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', headerEmphasis: 2 } });
  });

  it('sets site header emphasis to 3', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        HeaderEmphasis: 3
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', headerEmphasis: 3 } });
  });

  it('sets site menu mode to megamenu', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        MegaMenuEnabled: true
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', megaMenuEnabled: true } });
  });

  it('sets site menu mode to cascading', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        MegaMenuEnabled: false
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', megaMenuEnabled: false } });
  });

  it('updates all properties', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (opts.url === 'https://contoso.sharepoint.com/sites/team-a/_api/web') {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', title: 'New title', description: 'New description', siteLogoUrl: 'image.png', quickLaunchEnabled: true, headerLayout: 'compact', headerEmphasis: 1, megaMenuEnabled: true, footerEnabled: true, navAudienceTargetingEnabled: true } });
  });

  it('Update Welcome page', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (opts.url === 'https://contoso.sharepoint.com/sites/team-a/_api/web/RootFolder') {
        return;
      }
      if (opts.url === 'https://contoso.sharepoint.com/sites/team-a/_api/web') {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { welcomePage: 'SitePages/Home.aspx', url: 'https://contoso.sharepoint.com/sites/team-a' } });
  });

  it('Update Welcome page (debug)', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (opts.url === 'https://contoso.sharepoint.com/sites/team-a/_api/web/RootFolder') {
        return;
      }
      if (opts.url === 'https://contoso.sharepoint.com/sites/team-a/_api/web') {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { debug: true, welcomePage: 'SitePages/Home.aspx', url: 'https://contoso.sharepoint.com/sites/team-a' } });
  });

  it('correctly handles error when hub site not found', async () => {
    sinon.stub(request, 'patch').callsFake(() => {
      throw {
        error: {
          "odata.error": {
            "code": "-1, Microsoft.SharePoint.Client.ResourceNotFoundException",
            "message": {
              "lang": "en-US",
              "value": "Exception of type 'Microsoft.SharePoint.Client.ResourceNotFoundException' was thrown."
            }
          }
        }
      };
    });

    await assert.rejects(command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a' } }), new CommandError("Exception of type 'Microsoft.SharePoint.Client.ResourceNotFoundException' was thrown."));
  });

  it('correctly handles error while updating Welcome page', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (opts.url === 'https://contoso.sharepoint.com/sites/team-a/_api/web/RootFolder') {
        throw {
          error: {
            "odata.error": {
              "code": "-1, Microsoft.SharePoint.Client.ResourceNotFoundException",
              "message": {
                "lang": "en-US",
                "value": "The WelcomePage property must be a path that is relative to the folder, and the path cannot contain two consecutive periods (..)."
              }
            }
          }
        };
      }
      if (opts.url === 'https://contoso.sharepoint.com/sites/team-a/_api/web') {
        return;
      }

      throw 'Invalid request';
    });

    await assert.rejects(command.action(logger, {
      options: {
        welcomePage: 'https://contoso.sharepoint.com/sites/team-a/SitePages/Home.aspx',
        url: 'https://contoso.sharepoint.com/sites/team-a'
      }
    }), new CommandError('The WelcomePage property must be a path that is relative to the folder, and the path cannot contain two consecutive periods (..).'));
  });

  it('allows unknown properties', () => {
    const allowUnknownOptions = command.allowUnknownOptions();
    assert.strictEqual(allowUnknownOptions, true);
  });

  it('supports specifying url', () => {
    const options = command.options;
    let containsOption = false;
    options.forEach(o => {
      if (o.option.indexOf('--url') > -1) {
        containsOption = true;
      }
    });
    assert(containsOption);
  });

  it('fails validation if url is not a valid SharePoint URL', async () => {
    const actual = await command.validate({ options: { url: 'abc' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation when the url is a valid SharePoint URL', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a' } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('passes validation when the url is a valid SharePoint URL and quickLaunch set to "true"', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', quickLaunchEnabled: true } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('fails validation if headerLayout is invalid', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', headerLayout: 'invalid' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if headerLayout is set to standard', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', headerLayout: 'standard' } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('passes validation if headerLayout is set to compact', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', headerLayout: 'compact' } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('fails validation if headerEmphasis is not a number', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', headerEmphasis: 'abc' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if headerEmphasis is out of bounds', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', headerEmphasis: 4 } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if headerEmphasis is 0', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', headerEmphasis: 0 } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('passes validation if headerEmphasis is 1', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', headerEmphasis: 1 } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('passes validation if headerEmphasis is 2', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', headerEmphasis: 2 } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('passes validation if headerEmphasis is 3', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', headerEmphasis: 3 } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('passes validation if megaMenuEnabled is set to true', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', megaMenuEnabled: true } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('passes validation if megaMenuEnabled is set to false', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', megaMenuEnabled: false } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('passes validation if footerEnabled is set to true', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', footerEnabled: true } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('passes validation if footerEnabled is set to false', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', footerEnabled: false } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('passes validation if navAudienceTargetingEnabled is set to true', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', navAudienceTargetingEnabled: true } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('passes validation if navAudienceTargetingEnabled is set to false', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', navAudienceTargetingEnabled: false } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('enables footer', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        FooterEnabled: true
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', footerEnabled: true } });
  });

  it('disables footer', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        FooterEnabled: false
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', footerEnabled: false } });
  });

  it('enables navAudienceTargetingEnabled', async () => {
    const postRequestStub = sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (opts.url === 'https://contoso.sharepoint.com/sites/team-a/_api/web') {
        return;
      }

      throw 'Invalid request';
    });

    const requestBody = {
      NavAudienceTargetingEnabled: true
    };

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', navAudienceTargetingEnabled: true } });
    assert.deepStrictEqual(postRequestStub.lastCall.args[0].data, requestBody);
  });

  it('fails validation if search scope is not valid', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', searchScope: 'invalid' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if search scope is set to defaultscope', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', searchScope: 'defaultscope' } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('passes validation if search scope is set to tenant', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', searchScope: 'tenant' } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('passes validation if search scope is set to hub', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', searchScope: 'hub' } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('passes validation if search scope is set to site', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', searchScope: 'site' } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('passes validation even if search scope is not all lower case', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', searchScope: 'DefaultScope' } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('fails validation if search scope passed is a number', async () => {
    const actual = await command.validate({ options: { url: 'https://contoso.sharepoint.com/sites/team-a', searchScope: 2 } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('sets search scope to default scope', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        SearchScope: 0
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', searchScope: 'defaultscope' } });
  });

  it('sets search scope to tenant', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        SearchScope: 1
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', searchScope: 'tenant' } });
  });

  it('sets search scope to hub', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        SearchScope: 2
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', searchScope: 'hub' } });
  });

  it('sets search scope to site', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        SearchScope: 3
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', searchScope: 'site' } });
  });

  it('sets search scope even if parameter is not all lower case', async () => {
    sinon.stub(request, 'patch').callsFake(async (opts) => {
      if (JSON.stringify(opts.data) === JSON.stringify({
        SearchScope: 3
      })) {
        return;
      }

      throw 'Invalid request';
    });

    await command.action(logger, { options: { url: 'https://contoso.sharepoint.com/sites/team-a', searchScope: 'Site' } });
  });
});