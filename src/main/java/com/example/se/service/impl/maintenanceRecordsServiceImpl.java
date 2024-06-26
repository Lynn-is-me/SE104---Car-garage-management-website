package com.example.se.service.impl;

import com.example.se.model.maintenanceRecords;
import com.example.se.repository.maintenanceRecordsRepository;
import com.example.se.service.maintenanceRecordsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class maintenanceRecordsServiceImpl implements maintenanceRecordsService {

    private final maintenanceRecordsRepository maintenanceRecordsRepository;

    @Autowired
    public maintenanceRecordsServiceImpl(maintenanceRecordsRepository maintenanceRecordsRepository) {
        this.maintenanceRecordsRepository = maintenanceRecordsRepository;
    }

    @Override
    public List<maintenanceRecords> findAllRecords() {
        return this.maintenanceRecordsRepository.findAll();
    }

    /**
     * Implement save method
     * @param maintenanceRecords maintenanceRecords
     * @return
     * maintenanceRecords object which was saved
     */
    @Override
    public maintenanceRecords save(maintenanceRecords maintenanceRecords) {
        return this.maintenanceRecordsRepository.save(maintenanceRecords);
    }

    /**
     * Implement find by record id method
     * @param id: int
     * @return
     * maintenanceRecords object
     */
    @Override
    public maintenanceRecords findByRecordID(int id) {
        return this.maintenanceRecordsRepository.findByRecordID(id);
    }

    /**
     * Implement delete by id method
     * @param id: int
     */
    @Transactional
    @Override
    public void deleteByRecordID(int id) {
        this.maintenanceRecordsRepository.deleteByRecordID(id);
    }

    /**
     * Implement find by car ID
     * @param carID: int
     * @return
     * maintenanceRecords object
     */
    @Override
    public maintenanceRecords findByCarID(int carID) {
        return this.maintenanceRecordsRepository.findByCarID(carID);
    }
}
