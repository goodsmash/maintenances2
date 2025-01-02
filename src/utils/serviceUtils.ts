import { MaintenanceCategory, Service, SubCategory } from '../data/maintenanceCategories';

export const findServiceById = (
  categories: MaintenanceCategory[],
  serviceId: string
): Service | null => {
  for (const category of categories) {
    for (const subCategory of category.subCategories) {
      const service = subCategory.services.find(s => s.id === serviceId);
      if (service) return service;
    }
  }
  return null;
};

export const findSubCategoryById = (
  categories: MaintenanceCategory[],
  subCategoryId: string
): SubCategory | null => {
  for (const category of categories) {
    const subCategory = category.subCategories.find(s => s.id === subCategoryId);
    if (subCategory) return subCategory;
  }
  return null;
};

export const calculateServiceMetrics = (
  categories: MaintenanceCategory[]
): {
  totalServices: number;
  servicesPerCategory: { [key: string]: number };
  averagePrice: number;
} => {
  let totalServices = 0;
  const servicesPerCategory: { [key: string]: number } = {};
  let totalPrice = 0;
  let priceCount = 0;

  categories.forEach(category => {
    servicesPerCategory[category.name] = 0;
    category.subCategories.forEach(subCategory => {
      totalServices += subCategory.services.length;
      servicesPerCategory[category.name] += subCategory.services.length;
      
      subCategory.services.forEach(service => {
        totalPrice += (service.priceRange.min + service.priceRange.max) / 2;
        priceCount++;
      });
    });
  });

  return {
    totalServices,
    servicesPerCategory,
    averagePrice: priceCount > 0 ? totalPrice / priceCount : 0
  };
};

export const filterServicesByExpertise = (
  categories: MaintenanceCategory[],
  expertise: string
): Service[] => {
  const matchingServices: Service[] = [];
  
  categories.forEach(category => {
    category.subCategories.forEach(subCategory => {
      const services = subCategory.services.filter(service =>
        service.expertise.includes(expertise)
      );
      matchingServices.push(...services);
    });
  });

  return matchingServices;
};

export const getServicesByFrequency = (
  categories: MaintenanceCategory[],
  frequency: string
): Service[] => {
  const matchingServices: Service[] = [];
  
  categories.forEach(category => {
    category.subCategories.forEach(subCategory => {
      const services = subCategory.services.filter(service =>
        service.frequency === frequency
      );
      matchingServices.push(...services);
    });
  });

  return matchingServices;
};

export const getComplianceRequirements = (service: Service): string[] => {
  return service.compliance || [];
};

export const getRequiredCertifications = (service: Service): string[] => {
  return service.certifications || [];
};
