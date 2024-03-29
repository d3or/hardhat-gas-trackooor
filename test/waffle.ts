import { TASK_TEST } from 'hardhat/builtin-tasks/task-names';
// tslint:disable-next-line no-implicit-dependencies
import { useEnvironment } from './helpers';

describe('Waffle plugin with signers', function () {
  useEnvironment(__dirname + '/example');

  it('no options', async function () {
    await this.env.run(TASK_TEST, { testFiles: [] });
  });
});
