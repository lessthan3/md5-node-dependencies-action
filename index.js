const core = require('@actions/core');
const fs = require('fs');
const md5 = require('md5');

try {
  // `who-to-greet` input defined in action metadata file
  fs.readFile('package.json', (err, data) => {
    if (err) {
      throw err;
    }

    const contents = data.toString();
    console.log('package.json Contents:');
    console.log(contents);
    const packageJSON = JSON.parse(contents);
    const { dependencies } = packageJSON;
    for (const dep in dependencies) {
      if (dependencies[dep].startsWith('^')) {
        core.setFailed(`Dependency verions must be specific: ${dep}:${dependencies[dep]}`);
        return;
      }
    }
    const dependenciesStr = JSON.stringify(dependencies);
    const result = md5(dependenciesStr);
    console.log(`Dependencies MD5: ${result}`);
    core.setOutput("md5", result);
  });
} catch (error) {
  core.setFailed(error.message);
}