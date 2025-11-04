import { getVscodeApi } from '../src/webview/vscode';

const vscode = getVscodeApi();

/**
 * Requests suggestions from the Gemini API via the extension host.
 * This function sends a message and relies on a listener in the App component
 * to receive the response and update the relevant state.
 * @param description The description of the input field.
 */
export const requestSuggestionsForInput = (description: string): void => {
  // We don't return a promise here for simplicity. The response will be handled
  // by a global message listener in the App component, which then passes down
  // the suggestions as props.
  vscode.postMessage({
    command: 'getSuggestions',
    description: description,
  });
};