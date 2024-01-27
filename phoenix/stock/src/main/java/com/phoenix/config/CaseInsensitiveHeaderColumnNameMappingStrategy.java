package com.phoenix.config;

import com.opencsv.bean.CsvBindByName;
import com.opencsv.bean.HeaderColumnNameTranslateMappingStrategy;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

public class CaseInsensitiveHeaderColumnNameMappingStrategy<T> extends HeaderColumnNameTranslateMappingStrategy<T> {

    @Override
    public void setType(Class<? extends T> type) {
        super.setType(type);
        init();
    }

    private void init() {
        Map<String, String> columnMapping = new HashMap<>();

        Field[] fields = type.getDeclaredFields();
        for (Field field : fields) {
            CsvBindByName csvBindByName = field.getAnnotation(CsvBindByName.class);
            if (csvBindByName != null) {
                String columnName = csvBindByName.column();
                String normalizedColumnName = normalizeFieldName(columnName);
                columnMapping.put(normalizedColumnName, field.getName());
            }
        }
        setColumnMapping(columnMapping);
    }
    private String normalizeFieldName(String fieldName) {
        return fieldName.toLowerCase().replaceAll("\\s", "");
    }

}
