package com.phoenix.services;

import java.util.List;

public interface IUserServices {
    void assignRoles(String userId, List<String> realmRoles);
}
