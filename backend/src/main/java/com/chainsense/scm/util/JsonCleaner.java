package com.chainsense.scm.util;

/**
 * Strips markdown code fences and leading/trailing whitespace from LLM responses.
 * Gemini sometimes wraps output in ```json ... ``` even when instructed not to.
 */
public final class JsonCleaner {

    private JsonCleaner() {}

    public static String clean(String raw) {
        if (raw == null) return "{}";

        String trimmed = raw.strip();

        // Strip ```json ... ``` or ``` ... ```
        if (trimmed.startsWith("```")) {
            int firstNewline = trimmed.indexOf('\n');
            if (firstNewline != -1) {
                trimmed = trimmed.substring(firstNewline + 1);
            }
            if (trimmed.endsWith("```")) {
                trimmed = trimmed.substring(0, trimmed.lastIndexOf("```"));
            }
            trimmed = trimmed.strip();
        }

        return trimmed;
    }
}
