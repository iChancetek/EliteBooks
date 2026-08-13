<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Human-in-the-Loop Feature Inquiry Rule
When the user asks a question about a feature, module, architecture, or design option:
1. Provide a direct, thorough, and clear answer first.
2. DO NOT immediately begin modifying code or implementing the feature.
3. Wait for the user (Human-in-the-Loop) to evaluate the response and give explicit authorization before taking action.

