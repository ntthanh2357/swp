import React from 'react';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">ScholarConnect</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Kết nối học sinh với các cơ hội học bổng và chuyên gia tư vấn trên toàn thế giới. 
              Hành trình đến với sự xuất sắc học thuật bắt đầu từ đây.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Phone className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <MapPin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Dành cho học sinh</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Tìm học bổng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Duyệt cố vấn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Câu chuyện thành công</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mẹo ứng tuyển</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Dành cho cố vấn</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Trở thành cố vấn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tài nguyên cố vấn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cộng đồng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hỗ trợ</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ScholarConnect. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;