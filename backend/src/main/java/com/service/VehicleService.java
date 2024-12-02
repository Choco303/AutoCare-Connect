package com.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class VehicleService {

    // implement the car api
    private static final String BASE_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";

    @Autowired
    private RestTemplate restTemplate;

    /* using the api to get all the car makes.*/
    public String getMakes() {
        String url = BASE_URL + "/GetMakesForVehicleType/car?format=json";
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"Can not find the vehicle makes\"}";
        }
    }

    /* get the models for each specific make */
    public String getModels(String make) {
        String url = String.format(BASE_URL + "/GetModelsForMake/%s?format=json", make);
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"Unable to get model for " + make + ".\"}";
        }
    }

    /* let user type car model year */
    public String getYears() {
        int currentYear = java.util.Calendar.getInstance().get(java.util.Calendar.YEAR);
        StringBuilder years = new StringBuilder("[");
        for (int year = 2000; year <= currentYear; year++) {
            years.append(year).append(",");
        }
        years.setLength(years.length() - 1);
        years.append("]");
        return years.toString();
    }
}
