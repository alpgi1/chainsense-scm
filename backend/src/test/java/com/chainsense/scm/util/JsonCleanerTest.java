package com.chainsense.scm.util;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JsonCleanerTest {

    @Test
    void clean_withJsonFence_stripsMarkdown() {
        String input = "```json\n{\"key\": \"value\"}\n```";
        String result = JsonCleaner.clean(input);
        assertThat(result).isEqualTo("{\"key\": \"value\"}");
    }

    @Test
    void clean_withPlainFence_stripsMarkdown() {
        String input = "```\n{\"key\": \"value\"}\n```";
        String result = JsonCleaner.clean(input);
        assertThat(result).isEqualTo("{\"key\": \"value\"}");
    }

    @Test
    void clean_withNoFence_returnsOriginal() {
        String input = "{\"key\": \"value\"}";
        String result = JsonCleaner.clean(input);
        assertThat(result).isEqualTo("{\"key\": \"value\"}");
    }

    @Test
    void clean_withWhitespace_trims() {
        String input = "  {\"key\": \"value\"}  ";
        String result = JsonCleaner.clean(input);
        assertThat(result).isEqualTo("{\"key\": \"value\"}");
    }
}
