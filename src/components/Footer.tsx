import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-accent">MaintenancePro</span>
            </div>
            <p className="text-muted-foreground">
              Expert maintenance services for homes and businesses. Quality work, guaranteed satisfaction.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/services/appliance" className="text-muted-foreground hover:text-primary">Appliance Services</Link></li>
              <li><Link to="/services/contractor" className="text-muted-foreground hover:text-primary">Contractor Services</Link></li>
              <li><Link to="/services/emergency" className="text-muted-foreground hover:text-primary">Emergency Services</Link></li>
              <li><Link to="/services/maintenance" className="text-muted-foreground hover:text-primary">Maintenance Plans</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-primary">Careers</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com/maintenancepro" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://twitter.com/maintenancepro" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://instagram.com/maintenancepro" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com/company/maintenancepro" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-2">Stay updated with our latest services and tips</p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l border border-input bg-background"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-r hover:bg-primary/90"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MaintenancePro. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
              <Link to="/sitemap" className="text-sm text-muted-foreground hover:text-primary">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
