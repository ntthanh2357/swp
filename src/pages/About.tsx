import React from 'react';
import { Users, Award, Globe, Target, Heart, Zap, Mail, Phone, MapPin, Star, CheckCircle, TrendingUp, BookOpen } from 'lucide-react';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: 'Nguyễn Văn Minh',
      role: 'CEO & Founder',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
      bio: 'Hơn 15 năm kinh nghiệm trong lĩnh vực giáo dục và tư vấn du học.',
      education: 'MBA từ Harvard Business School',
      linkedin: '#'
    },
    {
      name: 'Trần Thị Lan',
      role: 'Giám đốc Học thuật',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
      bio: 'Chuyên gia tư vấn học bổng với hơn 500 học sinh được nhận học bổng.',
      education: 'PhD Giáo dục từ Stanford University',
      linkedin: '#'
    },
    {
      name: 'Lê Hoàng Nam',
      role: 'Giám đốc Công nghệ',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
      bio: 'Kỹ sư phần mềm với chuyên môn về AI và machine learning.',
      education: 'MS Computer Science từ MIT',
      linkedin: '#'
    },
    {
      name: 'Phạm Thị Hoa',
      role: 'Giám đốc Marketing',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
      bio: '10 năm kinh nghiệm marketing trong lĩnh vực giáo dục quốc tế.',
      education: 'MBA Marketing từ Wharton School',
      linkedin: '#'
    }
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: 'Sứ mệnh',
      description: 'Kết nối học sinh Việt Nam với các cơ hội học bổng và giáo dục chất lượng cao trên toàn thế giới.'
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: 'Tận tâm',
      description: 'Chúng tôi cam kết hỗ trợ mỗi học sinh với sự tận tâm và chuyên nghiệp cao nhất.'
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-600" />,
      title: 'Chất lượng',
      description: 'Cung cấp dịch vụ tư vấn chất lượng cao với đội ngũ chuyên gia có kinh nghiệm.'
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      title: 'Đổi mới',
      description: 'Ứng dụng công nghệ tiên tiến để mang lại trải nghiệm tốt nhất cho người dùng.'
    },
    {
      icon: <Globe className="h-8 w-8 text-green-600" />,
      title: 'Toàn cầu',
      description: 'Kết nối với mạng lưới các trường đại học và tổ chức giáo dục hàng đầu thế giới.'
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: 'Cộng đồng',
      description: 'Xây dựng cộng đồng học sinh và chuyên gia tư vấn hỗ trợ lẫn nhau.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Học sinh được hỗ trợ', icon: <Users className="h-6 w-6" /> },
    { number: '500+', label: 'Chuyên gia tư vấn', icon: <Award className="h-6 w-6" /> },
    { number: '95%', label: 'Tỷ lệ thành công', icon: <TrendingUp className="h-6 w-6" /> },
    { number: '50+', label: 'Quốc gia', icon: <Globe className="h-6 w-6" /> },
    { number: '$50M+', label: 'Học bổng đã đạt được', icon: <BookOpen className="h-6 w-6" /> },
    { number: '150+', label: 'Trường đại học đối tác', icon: <CheckCircle className="h-6 w-6" /> }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Thành lập ScholarConnect',
      description: 'Ra mắt nền tảng với sứ mệnh kết nối học sinh với các cơ hội học bổng toàn cầu.'
    },
    {
      year: '2021',
      title: 'Mở rộng mạng lưới',
      description: 'Hợp tác với hơn 50 trường đại học hàng đầu và 100 chuyên gia tư vấn.'
    },
    {
      year: '2022',
      title: 'Đạt mốc 5,000 học sinh',
      description: 'Hỗ trợ thành công 5,000 học sinh đầu tiên với tổng giá trị học bổng $20M.'
    },
    {
      year: '2023',
      title: 'Công nghệ AI',
      description: 'Tích hợp trí tuệ nhân tạo để cải thiện việc ghép nối học bổng phù hợp.'
    },
    {
      year: '2024',
      title: 'Mở rộng quốc tế',
      description: 'Phục vụ học sinh tại 50+ quốc gia với đội ngũ 500+ chuyên gia tư vấn.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Về ScholarConnect
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Chúng tôi tin rằng mọi học sinh đều xứng đáng có cơ hội tiếp cận nền giáo dục chất lượng cao, 
            bất kể hoàn cảnh tài chính.
          </p>
          <div className="flex items-center justify-center space-x-8 text-blue-200">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
              <span>Đáng tin cậy</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
              <span>Chuyên nghiệp</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
              <span>Hiệu quả</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-3 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Câu chuyện của chúng tôi
              </h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  ScholarConnect được thành lập vào năm 2020 với mục tiêu đơn giản nhưng đầy tham vọng: 
                  giúp các học sinh Việt Nam tiếp cận với những cơ hội giáo dục tốt nhất trên thế giới.
                </p>
                <p>
                  Chúng tôi nhận thấy rằng nhiều học sinh tài năng bỏ lỡ các cơ hội học bổng chỉ vì 
                  thiếu thông tin hoặc không biết cách tiếp cận. Điều này đã thúc đẩy chúng tôi xây dựng 
                  một nền tảng kết nối học sinh với các chuyên gia tư vấn có kinh nghiệm.
                </p>
                <p>
                  Sau 4 năm hoạt động, chúng tôi tự hào đã hỗ trợ hơn 10,000 học sinh đạt được 
                  ước mơ du học với tổng giá trị học bổng hơn 50 triệu USD.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1"
                alt="Đội ngũ ScholarConnect"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-2xl font-bold text-blue-600">95%</div>
                <div className="text-sm text-gray-600">Tỷ lệ thành công</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những giá trị này định hướng mọi hoạt động và quyết định của chúng tôi
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hành trình phát triển
            </h2>
            <p className="text-xl text-gray-600">
              Những cột mốc quan trọng trong quá trình xây dựng và phát triển ScholarConnect
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white shadow-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Đội ngũ lãnh đạo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những con người tài năng và tận tâm đứng sau thành công của ScholarConnect
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-3">{member.bio}</p>
                  <p className="text-gray-500 text-xs mb-4">{member.education}</p>
                  <a
                    href={member.linkedin}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    LinkedIn →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Liên hệ với chúng tôi
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn trong hành trình chinh phục ước mơ du học. 
                Hãy liên hệ để được tư vấn miễn phí!
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-gray-600">support@scholarconnect.vn</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Điện thoại</div>
                    <div className="text-gray-600">+84 28 1234 5678</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Địa chỉ</div>
                    <div className="text-gray-600">
                      Tầng 12, Tòa nhà Vietcombank<br />
                      198 Trần Quang Khải, Q.1, TP.HCM
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập email của bạn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tin nhắn
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Chia sẻ câu hỏi hoặc mong muốn của bạn..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  Gửi tin nhắn
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng bắt đầu hành trình của bạn?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Hãy tham gia cùng hàng nghìn học sinh đã thành công với ScholarConnect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors transform hover:scale-105"
            >
              Đăng ký ngay
            </a>
            <a
              href="/scholarships"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors transform hover:scale-105"
            >
              Khám phá học bổng
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;