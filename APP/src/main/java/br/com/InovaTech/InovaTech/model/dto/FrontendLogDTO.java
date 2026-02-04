package br.com.InovaTech.InovaTech.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FrontendLogDTO {
    private String timestamp;
    private String level;
    private String context;
    private String environment;
    private String message;
    private String userAgent;
    private String url;
    private Map<String, Object> metadata;
}
