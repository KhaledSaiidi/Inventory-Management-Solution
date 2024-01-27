package com.phoenix.config;

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
            String normalizedFieldName = field.getName().toLowerCase().replaceAll("\\s", "");
            columnMapping.put(normalizedFieldName, field.getName());
        }

        setColumnMapping(columnMapping);
    }
}
