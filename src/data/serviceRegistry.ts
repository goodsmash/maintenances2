import { MaintenanceCategory } from './maintenanceCategories';
import { residentialMaintenanceCategory } from './residentialServices';
import { commercialMaintenanceCategory } from './commercialServices';
import { industrialMaintenanceCategory } from './industrialMaintenanceServices';
import { institutionalMaintenanceCategory } from './institutionalMaintenanceServices';
import { transportationMaintenanceCategory } from './transportationServices';
import { environmentalMaintenanceCategory } from './environmentalServices';
import { energyMaintenanceCategory } from './energyServices';

export const maintenanceCategories: MaintenanceCategory[] = [
  residentialMaintenanceCategory,      // 200+ services
  commercialMaintenanceCategory,       // 250+ services
  industrialMaintenanceCategory,       // 300+ services
  institutionalMaintenanceCategory,    // 250+ services
  transportationMaintenanceCategory,   // 100+ services
  environmentalMaintenanceCategory,    // 100+ services
  energyMaintenanceCategory,          // 100+ services
];

export const getServiceCount = (): number => {
  let count = 0;
  maintenanceCategories.forEach(category => {
    category.subCategories.forEach(subCategory => {
      count += subCategory.services.length;
    });
  });
  return count;
};

export const getAllServices = () => {
  const services: Array<{
    categoryId: string;
    subCategoryId: string;
    service: any;
  }> = [];

  maintenanceCategories.forEach(category => {
    category.subCategories.forEach(subCategory => {
      subCategory.services.forEach(service => {
        services.push({
          categoryId: category.id,
          subCategoryId: subCategory.id,
          service
        });
      });
    });
  });

  return services;
};

export const getServicesByCategory = (categoryId: string) => {
  const category = maintenanceCategories.find(c => c.id === categoryId);
  if (!category) return [];

  const services: Array<{
    subCategoryId: string;
    service: any;
  }> = [];

  category.subCategories.forEach(subCategory => {
    subCategory.services.forEach(service => {
      services.push({
        subCategoryId: subCategory.id,
        service
      });
    });
  });

  return services;
};

export const searchServices = (query: string) => {
  const normalizedQuery = query.toLowerCase();
  const results: Array<{
    categoryId: string;
    subCategoryId: string;
    service: any;
    relevance: number;
  }> = [];

  maintenanceCategories.forEach(category => {
    category.subCategories.forEach(subCategory => {
      subCategory.services.forEach(service => {
        let relevance = 0;
        
        // Check name match
        if (service.name.toLowerCase().includes(normalizedQuery)) {
          relevance += 3;
        }
        
        // Check description match
        if (service.description.toLowerCase().includes(normalizedQuery)) {
          relevance += 2;
        }
        
        // Check expertise match
        if (service.expertise.some(e => e.toLowerCase().includes(normalizedQuery))) {
          relevance += 1;
        }

        if (relevance > 0) {
          results.push({
            categoryId: category.id,
            subCategoryId: subCategory.id,
            service,
            relevance
          });
        }
      });
    });
  });

  return results.sort((a, b) => b.relevance - a.relevance);
};
