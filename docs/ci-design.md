1. Which three stages will our pipeline include?

Lint
Build
Test

2. What event(s) should trigger the pipeline?

Pull Requests
Pushes

3. What is our quality gate?

Strict Blocking
Stop Work Protocol

4. How will we ensure it finishes in under 10 minutes? 

Alpine Base Image: Using node:18-alpine keeps the image size small (<200MB) for faster builds. 

Layer Caching: Copying package.json before the code ensures dependencies are cached. 

Fast Runner: Using ubuntu-latest provides high-speed execution for the pipeline.
