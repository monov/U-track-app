const entities = require('@jetbrains/youtrack-scripting-api/entities');


exports.httpHandler = {
  endpoints: [
    {
      method: 'POST',
      path: 'savetoggle',
      handle: (ctx) => {
        const body = JSON.parse(ctx.request.body)
        const projectId = ctx.request.getParameter('projectId')
        const project = entities.Project.findById(projectId)

        project.extensionProperties.toggle = body.toggle;
        ctx.response.json({body: body.toggle});
      }
    },
    {
      method: 'GET',
      path: 'test',
      handle: (ctx) => {

        ctx.response.json({message: '123'});
      }
    },
  ]
};

// this code is never used