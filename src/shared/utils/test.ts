import { escapeRegExp } from "../../shared/utils";

export function getLaunchConfig(noDebug: boolean, path: string, testName: string | undefined, isGroup: boolean, template?: any | undefined) {
	return Object.assign(
		{
			// Trailing space is a workaround for https://github.com/microsoft/vscode/issues/100115
			name: "Tests ",
			noDebug,
			request: "launch",
			type: "dart",
		},
		template,
		{
			args: (template ? (template.args || []) : []).concat(testName ? ["--name", makeRegexForTest(testName, isGroup)] : []),
			program: path,
		},
	);
}

const regexEscapedInterpolationExpressionPattern = /\\\$(?:(?:\w+)|(?:\\\{.*\\\}))/g;
export function makeRegexForTest(name: string, isGroup: boolean) {
	const prefix = "^";
	// We can't anchor to the end for groups, as we want them to run all children.
	const suffix = isGroup ? "" : "$";
	const escapedName = escapeRegExp(name);

	// If a test name contains interpolated expressions, passing the exact
	// name won't match. So we just replace them out with wildcards. We'll need
	// to do this after escaping for regex, to ensure the original expression
	// is escaped but our wildcard is not.
	const substitutedName = escapedName.replace(regexEscapedInterpolationExpressionPattern, ".*");
	return `${prefix}${substitutedName}${suffix}`;
}
