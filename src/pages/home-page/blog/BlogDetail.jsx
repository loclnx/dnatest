import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendar, FaUser, FaArrowLeft, FaClock, FaTag, FaChevronRight, FaHome } from 'react-icons/fa';

// Dữ liệu tối ưu cho các bài viết (loại bỏ views, likes, comments)
const articles = [
  {
    id: 1,
    title: "Công Nghệ Xét Nghiệm ADN Thế Hệ Mới 2024",
    category: "Kiến Thức",
    excerpt: "Khám phá những đột phá mới nhất trong công nghệ xét nghiệm ADN với độ chính xác 99.99% và tốc độ xử lý nhanh chóng.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop",
    slug: "cong-nghe-xet-nghiem-adn-the-he-moi-2024",
    author: "TS. Nguyễn Minh Khoa",
    date: "2024-01-25",
    readTime: "15 phút đọc",
    featured: true,
    tableOfContents: [
      { id: "1", title: "Giới thiệu công nghệ mới", level: 1 },
      { id: "2", title: "Công nghệ Next Generation Sequencing (NGS)", level: 1 },
      { id: "3", title: "Ưu điểm vượt trội so với phương pháp truyền thống", level: 1 },
      { id: "4", title: "Quy trình thực hiện chi tiết", level: 1 },
      { id: "5", title: "Ứng dụng trong y học pháp y", level: 1 },
      { id: "6", title: "Công nghệ AI và Machine Learning", level: 1 },
      { id: "7", title: "Tiêu chuẩn quốc tế và chứng nhận chất lượng", level: 1 },
      { id: "8", title: "So sánh chi phí và hiệu quả", level: 1 },
      { id: "9", title: "Xu hướng phát triển tương lai", level: 1 },
      { id: "10", title: "Kết luận và khuyến nghị", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <h2 id="1">Giới thiệu công nghệ mới</h2>
        <p>Công nghệ xét nghiệm ADN thế hệ mới năm 2024 đánh dấu một bước tiến vượt bậc trong lĩnh vực di truyền học và y học pháp y. Với sự phát triển của công nghệ sinh học phân tử, các phương pháp xét nghiệm ADN hiện đại đã vượt xa những giới hạn của các kỹ thuật truyền thống, mang lại độ chính xác cao hơn, tốc độ xử lý nhanh hơn và khả năng phân tích đa dạng hơn.</p>
        
        <p>Những tiến bộ đáng kể trong công nghệ này bao gồm việc ứng dụng trí tuệ nhân tạo (AI), học máy (Machine Learning), và các kỹ thuật giải trình tự thế hệ mới (Next Generation Sequencing - NGS). Điều này không chỉ cải thiện chất lượng kết quả mà còn mở ra những khả năng ứng dụng mới trong nhiều lĩnh vực khác nhau.</p>

        <h2 id="2">Công nghệ Next Generation Sequencing (NGS)</h2>
        <p>Next Generation Sequencing (NGS) là một trong những công nghệ tiên tiến nhất được áp dụng trong xét nghiệm ADN thế hệ mới. NGS cho phép giải trình tự hàng triệu đoạn ADN cùng một lúc, thay vì phải xử lý từng đoạn một như các phương pháp truyền thống.</p>
        
        <p><strong>Nguyên lý hoạt động của NGS:</strong></p>
        <ul>
          <li><strong>Chuẩn bị mẫu:</strong> ADN được tách chiết và cắt thành các đoạn nhỏ có kích thước phù hợp</li>
          <li><strong>Khuếch đại:</strong> Sử dụng kỹ thuật PCR để tạo ra nhiều bản sao của mỗi đoạn ADN</li>
          <li><strong>Giải trình tự:</strong> Các đoạn ADN được giải trình tự đồng thời bằng công nghệ quang học tiên tiến</li>
          <li><strong>Phân tích dữ liệu:</strong> Sử dụng thuật toán AI để xử lý và phân tích dữ liệu trình tự</li>
        </ul>
        
        <p>Công nghệ NGS có thể xử lý hàng tỷ nucleotide trong một lần chạy, cho phép phân tích toàn bộ genome hoặc các vùng đặc hiệu với độ chính xác cực cao.</p>

        <h2 id="3">Ưu điểm vượt trội so với phương pháp truyền thống</h2>
        <p>Công nghệ xét nghiệm ADN thế hệ mới mang lại nhiều ưu điểm vượt trội so với các phương pháp truyền thống:</p>
        
        <p><strong>1. Tốc độ xử lý nhanh chóng:</strong></p>
        <ul>
          <li>Kết quả có thể có trong vòng 24-48 giờ thay vì 5-7 ngày như trước</li>
          <li>Quy trình tự động hóa cao giảm thiểu thời gian thao tác thủ công</li>
          <li>Xử lý đồng thời nhiều mẫu trong một lần chạy</li>
        </ul>
        
        <p><strong>2. Độ chính xác vượt trội:</strong></p>
        <ul>
          <li>Đạt độ chính xác 99.99% với công nghệ AI tiên tiến</li>
          <li>Khả năng phát hiện các biến thể hiếm và đột biến điểm</li>
          <li>Giảm thiểu tỷ lệ kết quả âm tính giả và dương tính giả</li>
        </ul>
        
        <p><strong>3. Chi phí tối ưu:</strong></p>
        <ul>
          <li>Giảm 40-50% chi phí so với phương pháp cũ</li>
          <li>Tận dụng tối đa nguồn lực và thiết bị</li>
          <li>Giảm chi phí nhân công và vật tư tiêu hao</li>
        </ul>
        
        <p><strong>4. Quy trình đơn giản:</strong></p>
        <ul>
          <li>Chỉ cần mẫu nước bọt hoặc tế bào má</li>
          <li>Không cần lấy máu hay các mẫu xâm lấn</li>
          <li>Quy trình lấy mẫu đơn giản, an toàn</li>
        </ul>

        <h2 id="4">Quy trình thực hiện chi tiết</h2>
        <p>Quy trình xét nghiệm ADN thế hệ mới được thực hiện theo các bước chuẩn quốc tế, đảm bảo tính chính xác và bảo mật thông tin khách hàng:</p>
        
        <p><strong>Bước 1: Tiếp nhận và xử lý mẫu</strong></p>
        <ul>
          <li>Kiểm tra tính toàn vẹn của mẫu và thông tin khách hàng</li>
          <li>Mã hóa mẫu để đảm bảo tính bảo mật</li>
          <li>Bảo quản mẫu trong điều kiện nhiệt độ và độ ẩm phù hợp</li>
        </ul>
        
        <p><strong>Bước 2: Tách chiết ADN</strong></p>
        <ul>
          <li>Sử dụng kit tách chiết ADN chuyên dụng</li>
          <li>Kiểm tra chất lượng và nồng độ ADN</li>
          <li>Đánh giá độ tinh khiết của ADN tách chiết được</li>
        </ul>
        
        <p><strong>Bước 3: Khuếch đại và phân tích</strong></p>
        <ul>
          <li>Sử dụng kỹ thuật PCR để khuếch đại các vùng đích</li>
          <li>Áp dụng công nghệ NGS để giải trình tự</li>
          <li>Phân tích dữ liệu bằng phần mềm chuyên dụng</li>
        </ul>
        
        <p><strong>Bước 4: Kiểm tra chất lượng và báo cáo</strong></p>
        <ul>
          <li>Thực hiện kiểm tra chất lượng nội bộ</li>
          <li>So sánh với mẫu chuẩn quốc tế</li>
          <li>Lập báo cáo kết quả chi tiết và dễ hiểu</li>
        </ul>

        <h2 id="5">Ứng dụng trong y học pháp y</h2>
        <p>Công nghệ xét nghiệm ADN thế hệ mới có nhiều ứng dụng quan trọng trong y học pháp y và các lĩnh vực liên quan:</p>
        
        <p><strong>1. Xác định quan hệ huyết thống:</strong></p>
        <ul>
          <li>Xét nghiệm cha con với độ chính xác 99.99%</li>
          <li>Xác định quan hệ anh chị em ruột</li>
          <li>Xét nghiệm quan hệ ông bà - cháu</li>
          <li>Xác định quan hệ họ hàng xa</li>
        </ul>
        
        <p><strong>2. Giải quyết tranh chấp pháp lý:</strong></p>
        <ul>
          <li>Tranh chấp thừa kế tài sản</li>
          <li>Xác định quyền nuôi con</li>
          <li>Giải quyết các vụ việc dân sự</li>
          <li>Hỗ trợ điều tra hình sự</li>
        </ul>
        
        <p><strong>3. Nghiên cứu y học:</strong></p>
        <ul>
          <li>Nghiên cứu di truyền học quần thể</li>
          <li>Phát hiện các bệnh di truyền</li>
          <li>Nghiên cứu dược lý di truyền</li>
          <li>Phát triển liệu pháp gen</li>
        </ul>

        <h2 id="6">Công nghệ AI và Machine Learning</h2>
        <p>Trí tuệ nhân tạo và học máy đóng vai trò quan trọng trong việc nâng cao chất lượng xét nghiệm ADN:</p>
        
        <p><strong>Ứng dụng AI trong phân tích dữ liệu:</strong></p>
        <ul>
          <li><strong>Nhận dạng pattern:</strong> AI có thể nhận diện các mẫu phức tạp trong dữ liệu ADN</li>
          <li><strong>Dự đoán kết quả:</strong> Thuật toán học máy giúp dự đoán kết quả với độ chính xác cao</li>
          <li><strong>Phát hiện lỗi:</strong> Tự động phát hiện và sửa chữa các lỗi trong quá trình phân tích</li>
          <li><strong>Tối ưu hóa quy trình:</strong> AI giúp tối ưu hóa các bước trong quy trình xét nghiệm</li>
        </ul>
        
        <p><strong>Thuật toán Deep Learning:</strong></p>
        <p>Các mạng neural sâu được huấn luyện trên hàng triệu mẫu dữ liệu ADN để:</p>
        <ul>
          <li>Cải thiện độ chính xác của việc so sánh ADN</li>
          <li>Giảm thời gian phân tích từ giờ xuống phút</li>
          <li>Phát hiện các mối quan hệ phức tạp không thể nhận biết bằng mắt thường</li>
          <li>Dự đoán các đặc điểm di truyền từ dữ liệu ADN</li>
        </ul>

        <h2 id="7">Tiêu chuẩn quốc tế và chứng nhận chất lượng</h2>
        <p>Công nghệ xét nghiệm ADN thế hệ mới tuân thủ nghiêm ngặt các tiêu chuẩn quốc tế:</p>
        
        <p><strong>Tiêu chuẩn ISO/IEC 17025:</strong></p>
        <ul>
          <li>Đảm bảo năng lực của phòng thí nghiệm</li>
          <li>Quản lý chất lượng toàn diện</li>
          <li>Kiểm soát các yếu tố ảnh hưởng đến kết quả</li>
        </ul>
        
        <p><strong>Chuẩn AABB (American Association of Blood Banks):</strong></p>
        <ul>
          <li>Quy định về xét nghiệm quan hệ huyết thống</li>
          <li>Đảm bảo độ tin cậy của kết quả</li>
          <li>Kiểm tra chất lượng định kỳ</li>
        </ul>
        
        <p><strong>Chứng nhận CAP (College of American Pathologists):</strong></p>
        <ul>
          <li>Kiểm tra năng lực phòng thí nghiệm</li>
          <li>Đánh giá quy trình và thiết bị</li>
          <li>Đảm bảo tuân thủ các quy định quốc tế</li>
        </ul>

        <h2 id="8">So sánh chi phí và hiệu quả</h2>
        <p>Phân tích chi phí - hiệu quả của công nghệ mới so với phương pháp truyền thống:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Tiêu chí</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Phương pháp cũ</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Công nghệ mới</th>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Thời gian xử lý</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">5-7 ngày</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">24-48 giờ</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Độ chính xác</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">99.9%</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">99.99%</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Chi phí</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">100%</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">60%</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Số mẫu xử lý/ngày</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">50-100</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">500-1000</td>
          </tr>
        </table>
        
        <p><strong>Lợi ích kinh tế:</strong></p>
        <ul>
          <li>Giảm 40% chi phí vận hành</li>
          <li>Tăng 10 lần năng suất xử lý</li>
          <li>Giảm 60% thời gian chờ kết quả</li>
          <li>Tiết kiệm 30% nhân lực</li>
        </ul>

        <h2 id="9">Xu hướng phát triển tương lai</h2>
        <p>Công nghệ xét nghiệm ADN đang phát triển theo nhiều hướng đột phá:</p>
        
        <p><strong>1. Công nghệ Portable DNA Sequencing:</strong></p>
        <ul>
          <li>Thiết bị xét nghiệm ADN di động</li>
          <li>Kết quả nhanh chóng tại chỗ</li>
          <li>Ứng dụng trong cấp cứu và thảm họa</li>
        </ul>
        
        <p><strong>2. Quantum Computing trong phân tích ADN:</strong></p>
        <ul>
          <li>Tăng tốc độ xử lý dữ liệu lên hàng triệu lần</li>
          <li>Phân tích các mối quan hệ phức tạp</li>
          <li>Mở ra khả năng nghiên cứu genome toàn diện</li>
        </ul>
        
        <p><strong>3. Blockchain trong bảo mật dữ liệu:</strong></p>
        <ul>
          <li>Đảm bảo tính toàn vẹn của dữ liệu ADN</li>
          <li>Bảo vệ quyền riêng tư cá nhân</li>
          <li>Tạo hệ thống lưu trữ phi tập trung</li>
        </ul>
        
        <p><strong>4. AI tiên tiến và Neural Networks:</strong></p>
        <ul>
          <li>Phát triển các mô hình AI chuyên biệt</li>
          <li>Dự đoán các đặc điểm di truyền phức tạp</li>
          <li>Cá nhân hóa y học dựa trên ADN</li>
        </ul>

        <h2 id="10">Kết luận và khuyến nghị</h2>
        <p>Công nghệ xét nghiệm ADN thế hệ mới năm 2024 đại diện cho một bước tiến quan trọng trong lĩnh vực y học pháp y và di truyền học. Với những ưu điểm vượt trội về tốc độ, độ chính xác và chi phí, công nghệ này không chỉ cải thiện chất lượng dịch vụ mà còn mở ra nhiều cơ hội ứng dụng mới.</p>
        
        <p><strong>Khuyến nghị cho người dân:</strong></p>
        <ul>
          <li>Lựa chọn các trung tâm có chứng nhận quốc tế</li>
          <li>Tìm hiểu kỹ về quy trình và công nghệ được sử dụng</li>
          <li>Đảm bảo tính bảo mật thông tin cá nhân</li>
          <li>Tham khảo ý kiến chuyên gia trước khi quyết định</li>
        </ul>
        
        <p><strong>Khuyến nghị cho các cơ sở y tế:</strong></p>
        <ul>
          <li>Đầu tư vào công nghệ và thiết bị hiện đại</li>
          <li>Đào tạo nhân lực chuyên môn cao</li>
          <li>Xây dựng hệ thống quản lý chất lượng toàn diện</li>
          <li>Hợp tác với các tổ chức quốc tế</li>
        </ul>
        
        <p>Với sự phát triển không ngừng của khoa học công nghệ, chúng ta có thể kỳ vọng vào những đột phá mới trong tương lai gần, mang lại lợi ích to lớn cho xã hội và con người.</p>
      </div>
    `
  },
   {
    id: 2,
    title: "Quy Trình Hành Chính Xét Nghiệm ADN Tại Việt Nam",
    category: "Hành Chính",
    excerpt: "Hướng dẫn chi tiết các thủ tục hành chính cần thiết khi thực hiện xét nghiệm ADN theo quy định của Bộ Y tế.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=800&fit=crop",
    slug: "quy-trinh-hanh-chinh-xet-nghiem-adn-tai-viet-nam",
    author: "Luật sư Trần Văn Minh",
    date: "2024-01-23",
    readTime: "8 phút đọc",
    featured: false,
    views: 1420,
    likes: 98,
    comments: 25,
    tableOfContents: [
      { id: "", title: "Tư vấn và định hướng ban đầu", level: 1 },
      { id: "1", title: "Chuẩn bị hồ sơ", level: 1 },
      { id: "2", title: "Thực hiện xét nghiệm", level: 1 },
      { id: "3", title: "Nhận kết quả", level: 1 },
      { id: "4", title: "Xử lý và ứng dụng kết quả", level: 1 },
      { id: "5", title: "Lưu ý quan trọng", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <h2 id="0">Bước 0: Tư vấn và định hướng ban đầu</h2>
        <p>Tìm hiểu thông tin và nhận tư vấn chuyên môn trước khi quyết định thực hiện xét nghiệm:</p>    
        <p><strong>Đánh giá nhu cầu và mục đích:</strong></p>
        <ul>
          <li><strong>Mục đích cá nhân:</strong> Tìm hiểu quan hệ huyết thống trong gia đình</li>
          <li><strong>Mục đích pháp lý:</strong> Phục vụ tranh chấp dân sự, thừa kế, nhận con</li>
          <li><strong>Mục đích y tế:</strong> Chẩn đoán bệnh di truyền, ghép tạng</li>
          <li><strong>Mục đích xuất nhập cảnh:</strong> Chứng minh quan hệ gia đình cho visa</li>
        </ul>
        
        <p><strong>Lựa chọn loại xét nghiệm phù hợp:</strong></p>
        <ul>
          <li><strong>Xét nghiệm cha-con:</strong> Xác định quan hệ cha và con</li>
          <li><strong>Xét nghiệm mẹ-con:</strong> Xác định quan hệ mẹ và con</li>
          <li><strong>Xét nghiệm anh chị em:</strong> Xác định quan hệ anh chị em ruột</li>
          <li><strong>Xét nghiệm ông bà-cháu:</strong> Xác định quan hệ thế hệ thứ 2</li>
        </ul>

        <h2 id="1">Bước 1: Chuẩn bị hồ sơ</h2>
        <p>Chuẩn bị đầy đủ các giấy tờ cần thiết theo quy định của Thông tư 15/2020/TT-BYT:</p>
        
        <p><strong>Hồ sơ bắt buộc:</strong></p>
        <ul>
          <li><strong>CMND/CCCD/Hộ chiếu:</strong> Bản chính để đối chiếu + bản sao có công chứng</li>
          <li><strong>Giấy khai sinh:</strong> Đối với trẻ em dưới 14 tuổi</li>
          <li><strong>Đơn đề nghị xét nghiệm ADN:</strong> Theo mẫu của cơ sở y tế</li>
          <li><strong>Cam kết chịu trách nhiệm:</strong> Về tính chính xác thông tin</li>
        </ul>
        
        <p><strong>Hồ sơ bổ sung (nếu có):</strong></p>
        <ul>
          <li>Giấy ủy quyền có công chứng (nếu có người đại diện)</li>
          <li>Quyết định của Tòa án (trường hợp tranh chấp pháp lý)</li>
          <li>Giấy chứng tử + giấy phép khai quật (xét nghiệm sau tử vong)</li>
        </ul>
        
        <p><strong>Chi phí dự kiến:</strong></p>
        <ul>
          <li>Xét nghiệm cha-con: 2.500.000 - 4.000.000 VNĐ</li>
          <li>Xét nghiệm cha-mẹ-con: 3.500.000 - 4.500.000 VNĐ</li>
          <li>Giảm 20% cho người có BHYT, miễn phí cho hộ nghèo</li>
        </ul>

        <h2 id="2">Bước 2: Thực hiện xét nghiệm</h2>
        <p>Quy trình thực hiện tại cơ sở y tế được cấp phép:</p>
        
        <p><strong>Tiếp nhận hồ sơ (1-2 ngày):</strong></p>
        <ul>
          <li>Nộp hồ sơ tại quầy tiếp nhận</li>
          <li>Kiểm tra tính đầy đủ và hợp lệ</li>
          <li>Xác minh danh tính các bên tham gia</li>
          <li>Ký hợp đồng dịch vụ và thanh toán</li>
        </ul>
        
        <p><strong>Lấy mẫu sinh học (30 phút):</strong></p>
        <ul>
          <li>Tư vấn về phương pháp lấy mẫu phù hợp</li>
          <li>Lấy mẫu nước bọt, tế bào má hoặc máu</li>
          <li>Đóng gói và mã hóa mẫu đảm bảo bảo mật</li>
          <li>Vận chuyển mẫu đến phòng thí nghiệm</li>
        </ul>
        
        <p><strong>Xét nghiệm và phân tích (5-7 ngày):</strong></p>
        <ul>
          <li>Tách chiết ADN từ mẫu sinh học</li>
          <li>Khuếch đại vùng ADN đặc hiệu bằng PCR</li>
          <li>Phân tích kết quả bằng thiết bị tự động</li>
          <li>Kiểm tra chất lượng và xác nhận kết quả</li>
        </ul>

        <h2 id="3">Bước 3: Nhận kết quả</h2>
        <p>Nhận kết quả xét nghiệm và hiểu rõ ý nghĩa:</p>
        
        <p><strong>Thời gian và cách thức nhận kết quả:</strong></p>
        <ul>
          <li><strong>Thời gian:</strong> 7-10 ngày làm việc kể từ khi lấy mẫu</li>
          <li><strong>Nhận trực tiếp:</strong> Tại cơ sở y tế (thứ 2-6: 8h-16h30)</li>
          <li><strong>Gửi bưu điện:</strong> Phí bổ sung 50.000-100.000 VNĐ</li>
          <li><strong>Xét nghiệm khẩn cấp:</strong> 3-5 ngày (phụ phí 30-50%)</li>
        </ul>
        
        <p><strong>Hiểu kết quả xét nghiệm:</strong></p>
        <ul>
          <li><strong>Độ chính xác:</strong> 99.99% với công nghệ hiện đại</li>
          <li><strong>Kết quả dương tính:</strong> Xác nhận có quan hệ huyết thống</li>
          <li><strong>Kết quả âm tính:</strong> Loại trừ quan hệ huyết thống</li>
          <li><strong>Tư vấn:</strong> Được giải thích chi tiết ý nghĩa kết quả</li>
        </ul>
        
        <p><strong>Giá trị pháp lý:</strong></p>
        <ul>
          <li>Kết quả có giá trị pháp lý khi được cơ sở có thẩm quyền thực hiện</li>
          <li>Sử dụng trong các vụ việc dân sự, hình sự, thừa kế</li>
          <li>Cần bản dịch công chứng nếu sử dụng ở nước ngoài</li>
        </ul>

        <h2 id="4">Bước 4: Xử lý và ứng dụng kết quả</h2>
        <p>Sử dụng kết quả xét nghiệm cho các mục đích cụ thể và thực hiện các thủ tục liên quan:</p>
        
        <p><strong>Ứng dụng trong thủ tục pháp lý:</strong></p>
        <ul>
          <li><strong>Đăng ký khai sinh:</strong> Bổ sung thông tin cha/mẹ trên giấy khai sinh</li>
          <li><strong>Thừa kế tài sản:</strong> Chứng minh quyền thừa kế hợp pháp</li>
          <li><strong>Tranh chấp dân sự:</strong> Làm bằng chứng trong các vụ kiện tại tòa án</li>
          <li><strong>Nhận con nuôi:</strong> Chứng minh không có quan hệ huyết thống</li>
        </ul>
        
        <p><strong>Ứng dụng trong xuất nhập cảnh:</strong></p>
        <ul>
          <li><strong>Visa đoàn tụ gia đình:</strong> Chứng minh quan hệ gia đình</li>
          <li><strong>Định cư nước ngoài:</strong> Hỗ trợ hồ sơ định cư theo diện gia đình</li>
          <li><strong>Dịch thuật công chứng:</strong> Dịch kết quả sang ngôn ngữ nước đích</li>
          <li><strong>Hợp pháp hóa lãnh sự:</strong> Xác nhận tại đại sứ quán/lãnh sự quán</li>
        </ul>
        
        <p><strong>Bảo quản và lưu trữ kết quả:</strong></p>
        <ul>
          <li><strong>Lưu trữ bản gốc:</strong> Giữ ở nơi khô ráo, tránh ánh sáng trực tiếp</li>
          <li><strong>Sao chép công chứng:</strong> Làm bản sao có công chứng khi cần sử dụng</li>
          <li><strong>Lưu trữ điện tử:</strong> Scan và lưu trữ trên cloud an toàn</li>
          <li><strong>Thời hạn hiệu lực:</strong> Không giới hạn thời gian (trừ khi pháp luật quy định)</li>
        </ul>

        <h2 id="5">Bước 5: Lưu ý quan trọng</h2>
        <p>Những điều cần lưu ý để đảm bảo quyền lợi và tránh rủi ro:</p>
        
        <p><strong>Lựa chọn cơ sở y tế uy tín:</strong></p>
        <ul>
          <li><strong>Kiểm tra giấy phép:</strong> Đảm bảo có giấy phép hoạt động hợp pháp</li>
          <li><strong>Chứng nhận chất lượng:</strong> Có chứng nhận ISO/IEC 17025 hoặc AABB</li>
          <li><strong>Thiết bị hiện đại:</strong> Sử dụng công nghệ xét nghiệm tiên tiến</li>
          <li><strong>Đội ngũ chuyên môn:</strong> Kỹ thuật viên có chứng chỉ chuyên môn</li>
        </ul>
        
        <p><strong>Bảo mật và quyền riêng tư:</strong></p>
        <ul>
          <li><strong>Đồng ý tham gia:</strong> Đảm bảo có sự đồng ý của tất cả các bên</li>
          <li><strong>Cam kết bảo mật:</strong> Yêu cầu cơ sở y tế ký cam kết bảo mật</li>
          <li><strong>Quyền từ chối:</strong> Tôn trọng quyền từ chối tham gia xét nghiệm</li>
          <li><strong>Hủy mẫu:</strong> Yêu cầu hủy mẫu sinh học sau khi có kết quả</li>
        </ul>
        
        <p><strong>Quyền và nghĩa vụ:</strong></p>
        <ul>
          <li><strong>Quyền được thông tin:</strong> Được giải thích đầy đủ về quy trình</li>
          <li><strong>Quyền khiếu nại:</strong> Khi có vi phạm trong quá trình thực hiện</li>
          <li><strong>Nghĩa vụ cung cấp thông tin chính xác:</strong> Khai báo đúng sự thật</li>
          <li><strong>Nghĩa vụ thanh toán:</strong> Chi trả đầy đủ phí dịch vụ</li>
        </ul>
        
        <p><strong>Hỗ trợ tâm lý và xã hội:</strong></p>
        <ul>
          <li><strong>Tư vấn tâm lý:</strong> Hỗ trợ khi kết quả không như mong đợi</li>
          <li><strong>Dịch vụ hỗ trợ gia đình:</strong> Tư vấn về tác động đến mối quan hệ</li>
          <li><strong>Nhóm hỗ trợ cộng đồng:</strong> Kết nối với những trường hợp tương tự</li>
          <li><strong>Theo dõi sau xét nghiệm:</strong> Hỗ trợ trong 6 tháng đầu</li>
        </ul>
        
        <p><strong>Quyền khiếu nại và giải quyết tranh chấp:</strong></p>
        <ul>
          <li><strong>Khiếu nại về chất lượng:</strong> Gửi đến Sở Y tế địa phương</li>
          <li><strong>Khiếu nại về chi phí:</strong> Liên hệ trực tiếp với cơ sở y tế</li>
          <li><strong>Tranh chấp pháp lý:</strong> Thông qua tòa án có thẩm quyền</li>
          <li><strong>Bồi thường thiệt hại:</strong> Theo quy định của pháp luật</li>
        </ul>
        
        <p><strong>Câu hỏi thường gặp:</strong></p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Q: Xét nghiệm ADN có đau không?</strong><br>
          <strong>A:</strong> Hoàn toàn không đau. Chỉ cần lấy nước bọt hoặc chà nhẹ que cotton vào má.</p>
          
          <p><strong>Q: Có thể xét nghiệm khi mang thai không?</strong><br>
          <strong>A:</strong> Có thể từ tuần thứ 9 thai kỳ thông qua xét nghiệm máu mẹ.</p>
          
          <p><strong>Q: BHYT có chi trả không?</strong><br>
          <strong>A:</strong> Hiện tại BHYT chưa chi trả, nhưng có chính sách giảm giá cho người có thẻ BHYT.</p>
        </div>
      </div>
    `
  },
// ... existing code ...
{
  id: 3,
  title: "Tin Mới: Luật ADN 2025 Có Hiệu Lực Từ Tháng 3",
  category: "Tin Tức",
  excerpt: "Luật mới về xét nghiệm ADN chính thức có hiệu lực, mang lại nhiều thay đổi tích cực cho người dân.",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
  slug: "tin-moi-luat-adn-2024-co-hieu-luc-tu-thang-3",
  author: "Phóng viên Lê Thị Hoa",
  date: "2025-04-22",
  readTime: "15 phút đọc",
  featured: true,
  tableOfContents: [
    { id: "1", title: "Bước 1: Tổng quan về Luật ADN 2025", level: 1 },
    { id: "2", title: "Bước 2: Các quy định mới về thủ tục hành chính", level: 1 },
    { id: "3", title: "Bước 3: Quyền và nghĩa vụ của các bên tham gia", level: 1 },
    { id: "4", title: "Bước 4: Quy trình thực hiện xét nghiệm ADN", level: 1 },
    { id: "5", title: "Bước 5: Giá trị pháp lý của kết quả xét nghiệm", level: 1 },
    { id: "6", title: "Bước 6: Hướng dẫn thực hiện và lộ trình áp dụng", level: 1 }
  ],
  content: `
    <div class="blog-content">
      <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #2196F3;">
        <h3 style="color: #1976D2; margin-top: 0;">🏛️ THÔNG BÁO CHÍNH THỨC</h3>
        <p style="margin-bottom: 0; font-weight: 500;">Luật số 15/2025/QH15 về Xét nghiệm ADN trong các hoạt động dân sự và hình sự chính thức có hiệu lực từ ngày 15 tháng 3 năm 2025, thay thế các quy định trước đây và tạo khung pháp lý thống nhất cho toàn quốc.</p>
      </div>

      <h2 id="1">Bước 1: Tổng quan về Luật ADN 2025</h2>
      <p>Luật ADN 2025 được Quốc hội khóa XV thông qua tại kỳ họp thứ 8 với 456/462 đại biểu tán thành, đánh dấu bước tiến quan trọng trong việc hoàn thiện hệ thống pháp luật Việt Nam về xét nghiệm ADN.</p>
      
      <p><strong>Mục tiêu của Luật:</strong></p>
      <ul>
        <li><strong>Thống nhất quy trình:</strong> Tạo khung pháp lý thống nhất cho việc thực hiện xét nghiệm ADN trên toàn quốc</li>
        <li><strong>Bảo vệ quyền lợi:</strong> Đảm bảo quyền lợi hợp pháp của công dân trong các hoạt động xét nghiệm ADN</li>
        <li><strong>Nâng cao chất lượng:</strong> Đặt ra tiêu chuẩn cao về chất lượng dịch vụ xét nghiệm ADN</li>
        <li><strong>Minh bạch hóa:</strong> Tăng cường tính minh bạch trong quy trình và kết quả xét nghiệm</li>
      </ul>
      
      <p><strong>Phạm vi điều chỉnh:</strong></p>
      <ul>
        <li>Xét nghiệm ADN phục vụ các thủ tục dân sự (xác định quan hệ huyết thống, thừa kế)</li>
        <li>Xét nghiệm ADN trong điều tra, truy tố, xét xử các vụ án hình sự</li>
        <li>Xét nghiệm ADN phục vụ mục đích y tế, nghiên cứu khoa học</li>
        <li>Hoạt động của các cơ sở thực hiện xét nghiệm ADN</li>
      </ul>
      
      <p><strong>Nguyên tắc cơ bản:</strong></p>
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <ul>
          <li><strong>Tự nguyện:</strong> Việc xét nghiệm ADN phải dựa trên cơ sở tự nguyện của các bên (trừ trường hợp pháp luật quy định khác)</li>
          <li><strong>Chính xác:</strong> Đảm bảo độ chính xác cao nhất trong quy trình và kết quả</li>
          <li><strong>Bảo mật:</strong> Bảo vệ thông tin cá nhân và kết quả xét nghiệm</li>
          <li><strong>Công khai, minh bạch:</strong> Quy trình thực hiện phải công khai, minh bạch</li>
        </ul>
      </div>

      <h2 id="2">Bước 2: Các quy định mới về thủ tục hành chính</h2>
      <p>Luật ADN 2025 đơn giản hóa đáng kể các thủ tục hành chính, giảm thời gian và chi phí cho người dân:</p>
      
      <p><strong>Thủ tục đăng ký xét nghiệm:</strong></p>
      <ul>
        <li><strong>Hồ sơ đơn giản:</strong> Chỉ cần CCCD/CMND và đơn đăng ký (mẫu thống nhất)</li>
        <li><strong>Đăng ký trực tuyến:</strong> Có thể đăng ký qua Cổng dịch vụ công quốc gia</li>
        <li><strong>Thời gian xử lý:</strong> Tối đa 3 ngày làm việc (giảm từ 7 ngày trước đây)</li>
        <li><strong>Phí lệ phí:</strong> Giảm 25% so với quy định cũ, miễn phí cho hộ nghèo</li>
      </ul>
      
      <p><strong>Quy trình "một cửa":</strong></p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Bước</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Thủ tục</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Thời gian</th>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">1</td>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Nộp hồ sơ tại bộ phận một cửa</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">15 phút</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">2</td>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Kiểm tra hồ sơ và cấp phiếu hẹn</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">30 phút</td>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">3</td>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Lấy mẫu xét nghiệm</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">15 phút</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">4</td>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Nhận kết quả</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">24-48h</td>
        </tr>
      </table>
      
      <p><strong>Dịch vụ số hóa:</strong></p>
      <ul>
        <li><strong>Ứng dụng di động:</strong> Ra mắt app "ADN Việt Nam" để theo dõi tiến độ</li>
        <li><strong>Thanh toán điện tử:</strong> Hỗ trợ thanh toán qua ví điện tử, internet banking</li>
        <li><strong>Kết quả điện tử:</strong> Nhận kết quả qua email với chữ ký số</li>
        <li><strong>Lưu trữ đám mây:</strong> Kết quả được lưu trữ an toàn trên hệ thống quốc gia</li>
      </ul>

      <h2 id="3">Bước 3: Quyền và nghĩa vụ của các bên tham gia</h2>
      <p>Luật ADN 2025 quy định rõ ràng quyền và nghĩa vụ của từng bên tham gia để đảm bảo tính công bằng và minh bạch:</p>
      
      <p><strong>Quyền của người yêu cầu xét nghiệm:</strong></p>
      <ul>
        <li><strong>Quyền được thông tin:</strong> Được giải thích đầy đủ về quy trình, chi phí, thời gian</li>
        <li><strong>Quyền lựa chọn:</strong> Tự do lựa chọn cơ sở xét nghiệm có đủ điều kiện</li>
        <li><strong>Quyền bảo mật:</strong> Thông tin cá nhân và kết quả được bảo mật tuyệt đối</li>
        <li><strong>Quyền khiếu nại:</strong> Khiếu nại khi có vi phạm trong quá trình thực hiện</li>
        <li><strong>Quyền được bồi thường:</strong> Được bồi thường thiệt hại khi có sai sót</li>
      </ul>
      
      <p><strong>Nghĩa vụ của người yêu cầu xét nghiệm:</strong></p>
      <ul>
        <li><strong>Cung cấp thông tin chính xác:</strong> Khai báo đúng sự thật về nhân thân</li>
        <li><strong>Tuân thủ quy trình:</strong> Thực hiện đúng các bước theo hướng dẫn</li>
        <li><strong>Thanh toán đầy đủ:</strong> Chi trả phí dịch vụ theo quy định</li>
        <li><strong>Bảo mật thông tin:</strong> Không tiết lộ thông tin của người khác</li>
      </ul>
      
      <p><strong>Quyền của người tham gia xét nghiệm:</strong></p>
      <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #4CAF50;">
        <ul>
          <li><strong>Quyền từ chối:</strong> Có quyền từ chối tham gia xét nghiệm (trừ trường hợp bắt buộc theo pháp luật)</li>
          <li><strong>Quyền được tư vấn:</strong> Được tư vấn về ý nghĩa và hậu quả của xét nghiệm</li>
          <li><strong>Quyền biết kết quả:</strong> Được thông báo kết quả xét nghiệm (nếu đồng ý)</li>
          <li><strong>Quyền yêu cầu hủy mẫu:</strong> Yêu cầu hủy mẫu sinh học sau khi có kết quả</li>
        </ul>
      </div>
      
      <p><strong>Nghĩa vụ của cơ sở xét nghiệm:</strong></p>
      <ul>
        <li><strong>Đảm bảo chất lượng:</strong> Tuân thủ nghiêm ngặt các tiêu chuẩn kỹ thuật</li>
        <li><strong>Bảo mật thông tin:</strong> Xây dựng hệ thống bảo mật thông tin theo chuẩn quốc tế</li>
        <li><strong>Báo cáo định kỳ:</strong> Báo cáo hoạt động với cơ quan quản lý</li>
        <li><strong>Đào tạo nhân viên:</strong> Đảm bảo nhân viên có đủ trình độ chuyên môn</li>
        <li><strong>Bồi thường thiệt hại:</strong> Chịu trách nhiệm bồi thường khi có sai sót</li>
      </ul>

      <h2 id="4">Bước 4: Quy trình thực hiện xét nghiệm ADN</h2>
      <p>Luật ADN 2025 quy định quy trình chuẩn hóa, đảm bảo tính nhất quán trên toàn quốc:</p>
      
      <p><strong>Giai đoạn chuẩn bị:</strong></p>
      <ul>
        <li><strong>Tư vấn ban đầu:</strong> Giải thích về quy trình, chi phí, thời gian và ý nghĩa pháp lý</li>
        <li><strong>Ký cam kết:</strong> Các bên ký cam kết tham gia và tuân thủ quy định</li>
        <li><strong>Xác minh danh tính:</strong> Kiểm tra CCCD/CMND và chụp ảnh lưu hồ sơ</li>
        <li><strong>Lập biên bản:</strong> Ghi nhận đầy đủ thông tin các bên tham gia</li>
      </ul>
      
      <p><strong>Giai đoạn lấy mẫu:</strong></p>
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107;">
        <p><strong>⚠️ Lưu ý quan trọng:</strong> Việc lấy mẫu phải được thực hiện bởi nhân viên có chứng chỉ, trong sự chứng kiến của ít nhất 2 người và được ghi hình lưu trữ.</p>
      </div>
      
      <ul>
        <li><strong>Chuẩn bị dụng cụ:</strong> Sử dụng bộ kit lấy mẫu đã được kiểm định</li>
        <li><strong>Lấy mẫu nước bọt:</strong> Phương pháp ưu tiên, không xâm lấn</li>
        <li><strong>Lấy mẫu tế bào má:</strong> Sử dụng que cotton chuyên dụng</li>
        <li><strong>Đóng gói mẫu:</strong> Bảo quản trong điều kiện nhiệt độ phù hợp</li>
        <li><strong>Vận chuyển:</strong> Chuyển mẫu đến phòng thí nghiệm trong vòng 24h</li>
      </ul>
      
      <p><strong>Giai đoạn phân tích:</strong></p>
      <ul>
        <li><strong>Tách chiết ADN:</strong> Sử dụng công nghệ tự động hóa</li>
        <li><strong>Khuếch đại PCR:</strong> Nhân bản các đoạn ADN đích</li>
        <li><strong>Điện di phân tích:</strong> Phân tích các marker di truyền</li>
        <li><strong>So sánh dữ liệu:</strong> Sử dụng phần mềm chuyên dụng</li>
        <li><strong>Kiểm tra chất lượng:</strong> Thực hiện kiểm tra chéo với mẫu chuẩn</li>
      </ul>
      
      <p><strong>Tiêu chuẩn kỹ thuật bắt buộc:</strong></p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Tiêu chí</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Yêu cầu tối thiểu</th>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Số lượng marker</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Tối thiểu 20 marker</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">Độ chính xác</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">≥ 99.99%</td>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Thời gian báo cáo</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">≤ 5 ngày làm việc</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">Lưu trữ mẫu</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Tối thiểu 2 năm</td>
        </tr>
      </table>

      <h2 id="5">Bước 5: Giá trị pháp lý của kết quả xét nghiệm</h2>
      <p>Luật ADN 2025 nâng cao đáng kể giá trị pháp lý của kết quả xét nghiệm ADN trong các thủ tục pháp lý:</p>
      
      <p><strong>Giá trị làm bằng chứng:</strong></p>
      <ul>
        <li><strong>Bằng chứng khoa học:</strong> Được công nhận là bằng chứng khoa học có giá trị cao</li>
        <li><strong>Sức thuyết phục:</strong> Có sức thuyết phục mạnh trong các vụ việc dân sự và hình sự</li>
        <li><strong>Độ tin cậy:</strong> Được tòa án chấp nhận với độ tin cậy cao</li>
        <li><strong>Tính bắt buộc:</strong> Trong một số trường hợp, tòa án có thể yêu cầu bắt buộc thực hiện</li>
      </ul>
      
      <p><strong>Ứng dụng trong các lĩnh vực:</strong></p>
      
      <p><strong>1. Dân sự:</strong></p>
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <ul>
          <li><strong>Xác định quan hệ cha con:</strong> Làm cơ sở cho việc đăng ký khai sinh</li>
          <li><strong>Tranh chấp thừa kế:</strong> Xác định người thừa kế hợp pháp</li>
          <li><strong>Ly hôn và nuôi con:</strong> Xác định quyền nuôi con sau ly hôn</li>
          <li><strong>Nhận con nuôi:</strong> Chứng minh không có quan hệ huyết thống</li>
        </ul>
      </div>
      
      <p><strong>2. Hình sự:</strong></p>
      <ul>
        <li><strong>Điều tra tội phạm:</strong> Xác định danh tính nghi phạm</li>
        <li><strong>Bằng chứng tại tòa:</strong> Làm bằng chứng buộc tội hoặc minh oan</li>
        <li><strong>Xác định nạn nhân:</strong> Trong các vụ tai nạn, thảm họa</li>
        <li><strong>Tái thẩm:</strong> Cơ sở cho việc kháng nghị tái thẩm</li>
      </ul>
      
      <p><strong>3. Hành chính:</strong></p>
      <ul>
        <li><strong>Xuất nhập cảnh:</strong> Chứng minh quan hệ gia đình cho visa</li>
        <li><strong>Định cư:</strong> Hỗ trợ thủ tục định cư theo diện gia đình</li>
        <li><strong>Bảo hiểm:</strong> Xác định người thụ hưởng bảo hiểm</li>
        <li><strong>Trợ cấp xã hội:</strong> Xác định đối tượng được hưởng trợ cấp</li>
      </ul>
      
      <p><strong>Điều kiện để kết quả có giá trị pháp lý:</strong></p>
      <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #2196F3;">
        <ul>
          <li><strong>Cơ sở có đủ điều kiện:</strong> Được cấp phép hoạt động theo quy định</li>
          <li><strong>Quy trình đúng chuẩn:</strong> Tuân thủ nghiêm ngặt quy trình kỹ thuật</li>
          <li><strong>Nhân viên có chứng chỉ:</strong> Thực hiện bởi nhân viên được đào tạo</li>
          <li><strong>Có chứng kiến:</strong> Quá trình lấy mẫu có người chứng kiến</li>
          <li><strong>Bảo quản đúng cách:</strong> Mẫu được bảo quản theo đúng quy định</li>
        </ul>
      </div>

      <h2 id="6">Bước 6: Hướng dẫn thực hiện và lộ trình áp dụng</h2>
      <p>Để đảm bảo việc triển khai Luật ADN 2025 hiệu quả, các cơ quan chức năng đã xây dựng lộ trình cụ thể:</p>
      
      <p><strong>Giai đoạn 1 (Tháng 3-6/2025): Triển khai ban đầu</strong></p>
      <ul>
        <li><strong>Đào tạo cán bộ:</strong> Tập huấn cho 100% cán bộ liên quan</li>
        <li><strong>Cập nhật hệ thống:</strong> Nâng cấp hệ thống thông tin quản lý</li>
        <li><strong>Thí điểm tại 5 tỉnh/thành:</strong> Hà Nội, TP.HCM, Đà Nẵng, Cần Thơ, Hải Phòng</li>
        <li><strong>Tuyên truyền:</strong> Phổ biến rộng rãi đến người dân</li>
      </ul>
      
      <p><strong>Giai đoạn 2 (Tháng 7-12/2025): Mở rộng triển khai</strong></p>
      <ul>
        <li><strong>Triển khai toàn quốc:</strong> Áp dụng tại tất cả 63 tỉnh/thành</li>
        <li><strong>Hoàn thiện quy trình:</strong> Điều chỉnh dựa trên kinh nghiệm thí điểm</li>
        <li><strong>Kết nối liên ngành:</strong> Liên thông dữ liệu giữa các cơ quan</li>
        <li><strong>Đánh giá hiệu quả:</strong> Thực hiện đánh giá tác động</li>
      </ul>
      
      <p><strong>Giai đoạn 3 (Từ 2026): Hoàn thiện và phát triển</strong></p>
      <ul>
        <li><strong>Ứng dụng AI:</strong> Tích hợp trí tuệ nhân tạo vào quy trình</li>
        <li><strong>Mở rộng dịch vụ:</strong> Phát triển thêm các dịch vụ mới</li>
        <li><strong>Hợp tác quốc tế:</strong> Kết nối với cơ sở dữ liệu quốc tế</li>
        <li><strong>Nghiên cứu phát triển:</strong> Đầu tư vào R&D công nghệ mới</li>
      </ul>
      
      <p><strong>Hướng dẫn cho người dân:</strong></p>
      <p><strong>Chính sách hỗ trợ:</strong></p>
      <ul>
        <li><strong>Miễn phí:</strong> Hộ nghèo, cận nghèo được miễn 100% phí</li>
        <li><strong>Giảm 50%:</strong> Người có công với cách mạng</li>
        <li><strong>Giảm 30%:</strong> Học sinh, sinh viên, người cao tuổi</li>
        <li><strong>Trả góp:</strong> Cho phép thanh toán theo đợt với các trường hợp khó khăn</li>
      </ul>
      
      <p><strong>Cam kết chất lượng dịch vụ:</strong></p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Tiêu chí</th>
          <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Cam kết</th>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Thời gian xử lý hồ sơ</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">≤ 3 ngày làm việc</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">Thời gian có kết quả</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">≤ 5 ngày làm việc</td>
        </tr>
        <tr>
          <td style="border: 1px solid #dee2e6; padding: 12px;">Độ chính xác</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">≥ 99.99%</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="border: 1px solid #dee2e6; padding: 12px;">Tỷ lệ hài lòng</td>
          <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">≥ 95%</td>
        </tr>
      </table>
      <p><strong>Kết luận:</strong></p>
      <p>Luật ADN 2025 đánh dấu bước tiến quan trọng trong việc hiện đại hóa hệ thống pháp luật Việt Nam, mang lại nhiều lợi ích thiết thực cho người dân. Với 6 bước triển khai cụ thể, Luật không chỉ đơn giản hóa thủ tục mà còn nâng cao chất lượng dịch vụ, đảm bảo quyền lợi của công dân và tạo môi trường pháp lý thuận lợi cho sự phát triển của ngành xét nghiệm ADN tại Việt Nam.</p>
      
      <p>Người dân được khuyến khích tìm hiểu và tận dụng các quy định mới để bảo vệ quyền lợi hợp pháp của mình, đồng thời góp phần xây dựng xã hội văn minh, hiện đại.</p>
    </div>
  `
},
 // ... existing code ...
  {
    id: 4,
    title: "Giải Quyết Tranh Chấp Thừa Kế Bằng Xét Nghiệm ADN",
    category: "Dân Sự",
    excerpt: "Hướng dẫn toàn diện về vai trò quan trọng của xét nghiệm ADN trong việc giải quyết các tranh chấp thừa kế tài sản gia đình một cách công bằng và minh bạch.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=800&fit=crop",
    slug: "giai-quyet-tranh-chap-thua-ke-bang-xet-nghiem-adn",
    author: "Thẩm phán Phạm Thị Lan",
    date: "2024-01-20",
    readTime: "12 phút đọc",
    featured: false,
    views: 980,
    likes: 67,
    comments: 18,
    tableOfContents: [
      { id: "1", title: "Khi nào cần xét nghiệm ADN trong tranh chấp thừa kế?", level: 1 },
      { id: "2", title: "Xét nghiệm ADN pháp lý là gì?", level: 1 },
      { id: "3", title: "Quy trình thực hiện chi tiết", level: 1 },
      { id: "4", title: "Lợi ích của xét nghiệm ADN trong tranh chấp thừa kế", level: 1 },
      { id: "5", title: "Chi phí và thời gian thực hiện", level: 1 },
      { id: "6", title: "Những lưu ý quan trọng", level: 1 },
      { id: "7", title: "Các trường hợp thường gặp", level: 1 },
      { id: "8", title: "Kinh nghiệm thực tế từ các vụ việc", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">Tranh chấp thừa kế là một trong những vấn đề phức tạp nhất trong pháp luật dân sự, đặc biệt khi có nghi ngờ về mối quan hệ huyết thống giữa các bên. Xét nghiệm ADN đã trở thành công cụ khoa học đáng tin cậy, giúp tòa án và các bên liên quan giải quyết tranh chấp một cách công bằng, minh bạch và dứt khoát.</p>
        
        <h2 id="1">Khi nào cần xét nghiệm ADN trong tranh chấp thừa kế?</h2>
        <p>Xét nghiệm ADN được áp dụng trong các trường hợp tranh chấp thừa kế khi có nghi ngờ hoặc tranh cãi về mối quan hệ huyết thống giữa người để lại di sản và những người tự nhận là người thừa kế.</p>
        
        <p><strong>Các tình huống cụ thể:</strong></p>
        <ul>
          <li><strong>Tranh chấp về quan hệ cha-con:</strong> Khi có nghi ngờ về việc một người có phải là con ruột của người để lại di sản hay không</li>
          <li><strong>Xác định quan hệ anh chị em ruột:</strong> Trong trường hợp nhiều người cùng tuyên bố là anh chị em ruột của nhau</li>
          <li><strong>Quan hệ ông bà-cháu:</strong> Khi cần xác định mối quan hệ thế hệ thứ hai</li>
          <li><strong>Quan hệ cô dì-cháu:</strong> Xác định mối quan hệ họ hàng bên ngoài</li>
          <li><strong>Trường hợp con nuôi:</strong> Phân biệt giữa con nuôi và con ruột trong thừa kế</li>
          <li><strong>Nhận con ngoài giá thú:</strong> Xác định quyền thừa kế của con ngoài hôn nhân</li>
        </ul>
        
        <p><strong>Vai trò của tòa án:</strong></p>
        <p>Tòa án có thể yêu cầu thực hiện xét nghiệm ADN trong các trường hợp:</p>
        <ul>
          <li>Có đơn yêu cầu từ một trong các bên tranh chấp</li>
          <li>Tòa án thấy cần thiết để làm rõ sự thật</li>
          <li>Các bằng chứng khác không đủ để xác định quan hệ huyết thống</li>
          <li>Có sự mâu thuẫn trong các tài liệu, chứng từ</li>
        </ul>
        
        <div class="important-note">
          <p><strong>Lưu ý pháp lý:</strong> Xét nghiệm ADN giúp đảm bảo rằng người thừa kế thật sự là người có quyền về mặt pháp luật, bảo vệ quyền lợi hợp pháp của tất cả các bên liên quan.</p>
        </div>

        <h2 id="2">Xét nghiệm ADN pháp lý là gì?</h2>
        <p>Xét nghiệm ADN pháp lý (Legal/Administrative DNA Test) là loại xét nghiệm được thực hiện theo quy trình nghiêm ngặt, đáp ứng các tiêu chuẩn pháp lý để kết quả có thể được sử dụng trong các thủ tục tư pháp và hành chính.</p>
        
        <p><strong>Đặc điểm của xét nghiệm ADN pháp lý:</strong></p>
        <ul>
          <li><strong>Quy trình chuẩn hóa:</strong> Tuân thủ nghiêm ngặt các quy định của pháp luật</li>
          <li><strong>Xác minh danh tính:</strong> Kiểm tra chặt chẽ giấy tờ tùy thân của tất cả các bên</li>
          <li><strong>Thu mẫu chuyên nghiệp:</strong> Do nhân viên được đào tạo chuyên môn thực hiện</li>
          <li><strong>Niêm phong bảo mật:</strong> Mẫu được niêm phong và bảo quản theo quy trình an toàn</li>
          <li><strong>Chuỗi bảo quản (Chain of Custody):</strong> Theo dõi mẫu từ lúc lấy đến khi có kết quả</li>
          <li><strong>Chữ ký và cam kết:</strong> Tất cả các bên ký cam kết về tính chính xác thông tin</li>
        </ul>
        
        <p><strong>Ứng dụng của xét nghiệm ADN pháp lý:</strong></p>
        <ul>
          <li>Tranh chấp thừa kế tài sản</li>
          <li>Tranh tụng tại tòa án</li>
          <li>Thủ tục ly hôn và phân chia tài sản</li>
          <li>Đăng ký khai sinh muộn</li>
          <li>Bảo lãnh nhập cư, đoàn tụ gia đình</li>
          <li>Xác định danh tính nạn nhân tai nạn</li>
          <li>Các vụ việc pháp y hình sự</li>
        </ul>
        
        <p><strong>Giá trị pháp lý:</strong></p>
        <p>Kết quả xét nghiệm ADN pháp lý được tòa án và các cơ quan có thẩm quyền chấp nhận làm bằng chứng trong các thủ tục tư pháp, với độ tin cậy cao và có thể quyết định kết quả của vụ việc.</p>

        <h2 id="3">Quy trình thực hiện chi tiết</h2>
        <p>Quy trình xét nghiệm ADN trong tranh chấp thừa kế được thực hiện theo các bước chuẩn mực, đảm bảo tính chính xác và giá trị pháp lý.</p>
        
        <p><strong>Bước 1: Tòa án ra yêu cầu</strong></p>
        <ul>
          <li><strong>Văn bản chính thức:</strong> Tòa án ban hành quyết định hoặc văn bản yêu cầu xét nghiệm ADN</li>
          <li><strong>Nội dung cụ thể:</strong> Xác định rõ các bên cần xét nghiệm và mục đích</li>
          <li><strong>Thời hạn thực hiện:</strong> Quy định thời gian hoàn thành xét nghiệm</li>
          <li><strong>Cơ sở thực hiện:</strong> Có thể chỉ định cơ sở xét nghiệm cụ thể</li>
        </ul>
        
        <p><strong>Bước 2: Lựa chọn trung tâm xét nghiệm uy tín</strong></p>
        <p>Các tiêu chí lựa chọn trung tâm xét nghiệm:</p>
        <ul>
          <li><strong>Giấy phép hoạt động:</strong> Được Bộ Y tế cấp phép hoạt động</li>
          <li><strong>Chứng nhận chất lượng:</strong> Có các chứng nhận quốc tế (ISO 17025, AABB, CAP)</li>
          <li><strong>Kinh nghiệm và uy tín:</strong> Có nhiều năm kinh nghiệm trong lĩnh vực</li>
          <li><strong>Công nghệ hiện đại:</strong> Sử dụng thiết bị và kỹ thuật tiên tiến</li>
          <li><strong>Đội ngũ chuyên gia:</strong> Có bác sĩ, kỹ thuật viên được đào tạo chuyên sâu</li>
        </ul>
        
        <p><strong>Các trung tâm uy tín tại Việt Nam:</strong></p>
        <ul>
          <li>Trung tâm Xét nghiệm ADN NOVAGEN</li>
          <li>Công ty ADN Việt Nam</li>
          <li>Trung tâm ADN TOPGEN</li>
          <li>Phòng thí nghiệm GENFAMILY</li>
          <li>Trung tâm Y tế VIETCARE</li>
        </ul>
        
        <p><strong>Bước 3: Chuẩn bị giấy tờ và lấy mẫu</strong></p>
        <p><strong>Giấy tờ cần thiết:</strong></p>
        <ul>
          <li><strong>CMND/CCCD/Hộ chiếu:</strong> Bản chính để đối chiếu</li>
          <li><strong>Giấy khai sinh:</strong> Đối với trẻ em dưới 14 tuổi</li>
          <li><strong>Quyết định của tòa án:</strong> Văn bản yêu cầu xét nghiệm</li>
          <li><strong>Giấy ủy quyền:</strong> Nếu có người đại diện</li>
          <li><strong>Các giấy tờ liên quan:</strong> Giấy chứng tử, di chúc (nếu có)</li>
        </ul>
        
        <p><strong>Quy trình lấy mẫu:</strong></p>
        <ul>
          <li><strong>Xác minh danh tính:</strong> Kiểm tra kỹ giấy tờ tùy thân</li>
          <li><strong>Chụp ảnh:</strong> Chụp ảnh các bên tham gia xét nghiệm</li>
          <li><strong>Lấy mẫu sinh học:</strong> Thường là nước bọt hoặc tế bào má</li>
          <li><strong>Có người chứng kiến:</strong> Luật sư hoặc đại diện tòa án</li>
          <li><strong>Niêm phong mẫu:</strong> Đóng gói và niêm phong theo quy trình</li>
          <li><strong>Ký xác nhận:</strong> Tất cả các bên ký xác nhận việc lấy mẫu</li>
        </ul>
        
        <p><strong>Bước 4: Phân tích mẫu</strong></p>
        <ul>
          <li><strong>Kỹ thuật PCR-STR:</strong> Sử dụng công nghệ tiên tiến nhất hiện nay</li>
          <li><strong>Phân tích nhiều marker:</strong> Thường 15-20 vị trí STR khác nhau</li>
          <li><strong>Độ chính xác cao:</strong> Đạt ≥99.9% trong xác định quan hệ</li>
          <li><strong>Kiểm tra chất lượng:</strong> Quy trình QC/QA nghiêm ngặt</li>
          <li><strong>Xác nhận kết quả:</strong> Được ít nhất 2 chuyên gia xác nhận</li>
        </ul>
        
        <p><strong>Bước 5: Trả kết quả</strong></p>
        <ul>
          <li><strong>Gửi trực tiếp tòa án:</strong> Kết quả được gửi niêm phong đến tòa án</li>
          <li><strong>Thông báo các bên:</strong> Các bên liên quan được thông báo</li>
          <li><strong>Giải thích kết quả:</strong> Chuyên gia giải thích ý nghĩa kết quả</li>
          <li><strong>Bổ sung hồ sơ:</strong> Kết quả trở thành bằng chứng trong hồ sơ vụ việc</li>
        </ul>

        <h2 id="4">Lợi ích của xét nghiệm ADN trong tranh chấp thừa kế</h2>
        <p>Việc sử dụng xét nghiệm ADN trong giải quyết tranh chấp thừa kế mang lại nhiều lợi ích thiết thực cho tòa án, các bên liên quan và xã hội.</p>
        
        <p><strong>1. Bằng chứng khoa học đáng tin cậy</strong></p>
        <ul>
          <li><strong>Độ chính xác cao:</strong> Đạt 99.99% trong xác định quan hệ huyết thống</li>
          <li><strong>Khách quan, trung lập:</strong> Không bị ảnh hưởng bởi yếu tố chủ quan</li>
          <li><strong>Không thể làm giả:</strong> Dựa trên đặc điểm di truyền độc nhất</li>
          <li><strong>Được quốc tế công nhận:</strong> Áp dụng rộng rãi trên toàn thế giới</li>
        </ul>
        
        <p><strong>2. Xử lý tranh chấp nhanh chóng</strong></p>
        <ul>
          <li><strong>Rút ngắn thời gian:</strong> Tránh kéo dài vụ việc nhiều năm</li>
          <li><strong>Giảm chi phí tố tụng:</strong> Ít phiên tòa, ít thủ tục phức tạp</li>
          <li><strong>Kết luận dứt khoát:</strong> Không để lại nghi ngờ hay tranh cãi</li>
          <li><strong>Giảm tải cho tòa án:</strong> Hỗ trợ thẩm phán đưa ra quyết định chính xác</li>
        </ul>
        
        <p><strong>3. Đảm bảo tính minh bạch và công bằng</strong></p>
        <ul>
          <li><strong>Xác nhận người có quyền:</strong> Đảm bảo chỉ người thừa kế hợp pháp được hưởng di sản</li>
          <li><strong>Loại trừ người không có quyền:</strong> Ngăn chặn việc chiếm đoạt tài sản trái phép</li>
          <li><strong>Bảo vệ quyền lợi các bên:</strong> Cả người thừa kế thật và người để lại di sản</li>
          <li><strong>Tạo niềm tin xã hội:</strong> Củng cố lòng tin vào hệ thống tư pháp</li>
        </ul>
        
        <p><strong>4. Bảo vệ đặc biệt cho trẻ em và người yếu thế</strong></p>
        <ul>
          <li><strong>Quyền lợi trẻ em:</strong> Đảm bảo trẻ em được hưởng thừa kế đúng quy định</li>
          <li><strong>Bảo vệ người thừa kế thật:</strong> Không bị mất quyền lợi do thiếu bằng chứng</li>
          <li><strong>Ngăn chặn lừa đảo:</strong> Tránh trường hợp giả mạo quan hệ huyết thống</li>
          <li><strong>Đặc biệt quan trọng:</strong> Khi tài sản lớn hoặc quan hệ huyết thống không rõ ràng</li>
        </ul>
        
        <p><strong>5. Giá trị xã hội tích cực</strong></p>
        <ul>
          <li><strong>Giảm mâu thuẫn gia đình:</strong> Tránh chia rẽ, hận thù trong gia đình</li>
          <li><strong>Bảo vệ truyền thống:</strong> Duy trì các giá trị gia đình truyền thống</li>
          <li><strong>Tạo tiền lệ tốt:</strong> Khuyến khích giải quyết tranh chấp bằng khoa học</li>
          <li><strong>Nâng cao ý thức pháp luật:</strong> Giúp người dân hiểu và tôn trọng pháp luật</li>
        </ul>

        <h2 id="5">Chi phí và thời gian thực hiện</h2>
        <p>Chi phí và thời gian thực hiện xét nghiệm ADN trong tranh chấp thừa kế phụ thuộc vào nhiều yếu tố như loại xét nghiệm, số lượng người tham gia và mức độ ưu tiên.</p>
        
        <p><strong>Bảng giá tham khảo (năm 2024):</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Loại xét nghiệm</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Chi phí (VNĐ)</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Thời gian</th>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xét nghiệm cha-con (pháp lý)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">4.000.000 - 5.000.000</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3-5 ngày</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xét nghiệm cha-mẹ-con</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">5.500.000 - 6.500.000</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">3-5 ngày</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xét nghiệm anh chị em ruột</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">6.000.000 - 7.000.000</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">5-7 ngày</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; padding: 12px;">Xét nghiệm ông bà-cháu</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">7.000.000 - 8.000.000</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">5-7 ngày</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; padding: 12px;">Gói ưu tiên (1-2 ngày)</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">+50% phí cơ bản</td>
            <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">1-2 ngày</td>
          </tr>
        </table>
        
        <p><strong>Các yếu tố ảnh hưởng đến chi phí:</strong></p>
        <ul>
          <li><strong>Số lượng người tham gia:</strong> Càng nhiều người càng tốn chi phí</li>
          <li><strong>Loại mối quan hệ:</strong> Quan hệ xa hơn thường phức tạp hơn</li>
          <li><strong>Mức độ ưu tiên:</strong> Xét nghiệm khẩn cấp có phụ phí</li>
          <li><strong>Chất lượng mẫu:</strong> Mẫu kém chất lượng cần xử lý đặc biệt</li>
          <li><strong>Yêu cầu đặc biệt:</strong> Báo cáo chi tiết, tư vấn chuyên sâu</li>
        </ul>
        
        <p><strong>Thời gian thực hiện chi tiết:</strong></p>
        <ul>
          <li><strong>Chuẩn bị hồ sơ:</strong> 1-2 ngày</li>
          <li><strong>Lấy mẫu:</strong> 1 ngày</li>
          <li><strong>Phân tích mẫu:</strong> 2-4 ngày</li>
          <li><strong>Kiểm tra chất lượng:</strong> 1 ngày</li>
          <li><strong>Lập báo cáo:</strong> 1 ngày</li>
          <li><strong>Gửi kết quả:</strong> 1 ngày</li>
        </ul>
        
        <p><strong>Chính sách hỗ trợ chi phí:</strong></p>
        <ul>
          <li><strong>Hộ nghèo, cận nghèo:</strong> Miễn phí hoặc giảm 70-80%</li>
          <li><strong>Người có công:</strong> Giảm 50% chi phí</li>
          <li><strong>Trẻ em mồ côi:</strong> Ưu tiên hỗ trợ từ các quỹ xã hội</li>
          <li><strong>Thanh toán trả góp:</strong> Cho phép thanh toán theo đợt</li>
        </ul>

        <h2 id="6">Những lưu ý quan trọng</h2>
        <p>Để đảm bảo xét nghiệm ADN đạt hiệu quả cao và có giá trị pháp lý, các bên cần lưu ý những điểm quan trọng sau:</p>
        
        <p><strong>1. Lựa chọn đơn vị thực hiện uy tín</strong></p>
        <ul>
          <li><strong>Giấy phép hợp lệ:</strong> Kiểm tra giấy phép hoạt động của Bộ Y tế</li>
          <li><strong>Chứng nhận chất lượng:</strong> Có các chứng nhận quốc tế về chất lượng</li>
          <li><strong>Quy trình chuẩn pháp lý:</strong> Tuân thủ đúng quy trình để kết quả được công nhận</li>
          <li><strong>Kinh nghiệm thực tế:</strong> Có nhiều năm kinh nghiệm xử lý các vụ việc pháp lý</li>
          <li><strong>Đội ngũ chuyên gia:</strong> Có bác sĩ, luật sư tư vấn chuyên nghiệp</li>
        </ul>
        
        <p><strong>2. Chuẩn bị giấy tờ đầy đủ và chính xác</strong></p>
        <ul>
          <li><strong>CMND/CCCD:</strong> Phải còn hiệu lực, rõ ràng, không bị hư hỏng</li>
          <li><strong>Giấy khai sinh:</strong> Bản chính hoặc bản sao có công chứng</li>
          <li><strong>Quyết định tòa án:</strong> Văn bản chính thức yêu cầu xét nghiệm</li>
          <li><strong>Giấy ủy quyền:</strong> Có công chứng nếu có người đại diện</li>
          <li><strong>Các giấy tờ khác:</strong> Di chúc, giấy chứng tử, sổ hộ khẩu (nếu cần)</li>
        </ul>
        
        <p><strong>3. Đảm bảo quy trình lấy mẫu đúng chuẩn</strong></p>
        <ul>
          <li><strong>Có người chứng kiến:</strong> Luật sư, đại diện tòa án hoặc cơ quan có thẩm quyền</li>
          <li><strong>Niêm phong bảo mật:</strong> Mẫu được niêm phong ngay sau khi lấy</li>
          <li><strong>Ghi nhận đầy đủ:</strong> Thông tin người lấy mẫu, thời gian, địa điểm</li>
          <li><strong>Ký xác nhận:</strong> Tất cả các bên ký xác nhận việc lấy mẫu</li>
          <li><strong>Bảo quản đúng cách:</strong> Mẫu được bảo quản trong điều kiện thích hợp</li>
        </ul>
        
        <p><strong>4. Tham vấn luật sư chuyên nghiệp</strong></p>
        <ul>
          <li><strong>Hiểu rõ quyền lợi:</strong> Luật sư giải thích quyền và nghĩa vụ của các bên</li>
          <li><strong>Đánh giá rủi ro:</strong> Phân tích các tình huống có thể xảy ra</li>
          <li><strong>Chuẩn bị chiến lược:</strong> Lập kế hoạch xử lý dựa trên kết quả</li>
          <li><strong>Hỗ trợ thủ tục:</strong> Giúp hoàn thiện các thủ tục pháp lý</li>
          <li><strong>Đại diện tại tòa:</strong> Bảo vệ quyền lợi trong quá trình tố tụng</li>
        </ul>
        
        <p><strong>5. Chuẩn bị tâm lý cho kết quả</strong></p>
        <ul>
          <li><strong>Chấp nhận sự thật:</strong> Sẵn sàng đối mặt với mọi kết quả</li>
          <li><strong>Tôn trọng kết quả:</strong> Không tranh cãi hay nghi ngờ kết quả khoa học</li>
          <li><strong>Bảo vệ danh tiếng:</strong> Giữ bí mật thông tin cá nhân và gia đình</li>
          <li><strong>Hòa giải gia đình:</strong> Ưu tiên hòa giải, tránh chia rẽ gia đình</li>
          <li><strong>Tuân thủ pháp luật:</strong> Thực hiện đúng quyết định của tòa án</li>
        </ul>
        
        <div class="warning-box">
          <p><strong>Cảnh báo quan trọng:</strong> Việc làm giả kết quả xét nghiệm ADN hoặc cung cấp thông tin sai lệch có thể bị xử lý hình sự theo quy định của pháp luật. Các bên cần thực hiện trung thực và tuân thủ đúng quy định.</p>
        </div>

        <h2 id="7">Các trường hợp thường gặp</h2>
        <p>Dựa trên kinh nghiệm thực tế, có một số trường hợp tranh chấp thừa kế thường gặp cần sử dụng xét nghiệm ADN:</p>
        
        <p><strong>Trường hợp 1: Tranh chấp về con ruột</strong></p>
        <ul>
          <li><strong>Tình huống:</strong> Người chồng qua đời, vợ và con trai tranh chấp với một phụ nữ khác tuyên bố có con với người chồng</li>
          <li><strong>Giải pháp:</strong> Xét nghiệm ADN giữa đứa trẻ với người chồng đã mất (qua mẫu từ con trai hoặc cha mẹ của người chồng)</li>
          <li><strong>Kết quả:</strong> Xác định được đứa trẻ có phải con ruột hay không, từ đó quyết định quyền thừa kế</li>
        </ul>
        
        <p><strong>Trường hợp 2: Xác định anh chị em ruột</strong></p>
        <ul>
          <li><strong>Tình huống:</strong> Gia đình có nhiều con, một số được nuôi ở nơi khác, khi cha mẹ mất có tranh chấp về quan hệ huyết thống</li>
          <li><strong>Giải pháp:</strong> Xét nghiệm ADN giữa các anh chị em để xác định mối quan hệ</li>
          <li><strong>Kết quả:</strong> Phân biệt được con ruột và con nuôi, chia thừa kế đúng quy định</li>
        </ul>
        
        <p><strong>Trường hợp 3: Tranh chấp thế hệ thứ hai</strong></p>
        <ul>
          <li><strong>Tình huống:</strong> Ông bà mất, có người tuyên bố là cháu ruột nhưng không có giấy tờ chứng minh</li>
          <li><strong>Giải pháp:</strong> Xét nghiệm ADN với các cháu khác đã được xác nhận hoặc với con còn sống của ông bà</li>
          <li><strong>Kết quả:</strong> Xác định được mối quan hệ ông bà - cháu, quyết định quyền thừa kế</li>
        </ul>
        
        <p><strong>Trường hợp 4: Con ngoài giá thú</strong></p>
        <ul>
          <li><strong>Tình huống:</strong> Người đàn ông có vợ con hợp pháp, nhưng có con với người phụ nữ khác, khi mất có tranh chấp thừa kế</li>
          <li><strong>Giải pháp:</strong> Xét nghiệm ADN để xác định quan hệ cha con</li>
          <li><strong>Kết quả:</strong> Con ngoài giá thú được xác nhận có quyền thừa kế theo quy định pháp luật</li>
        </ul>
        
        <p><strong>Trường hợp 5: Nhận con nuôi không đúng thủ tục</strong></p>
        <ul>
          <li><strong>Tình huống:</strong> Gia đình nhận nuôi con nhưng không làm thủ tục, sau này có tranh chấp về quyền thừa kế</li>
          <li><strong>Giải pháp:</strong> Xét nghiệm ADN để phân biệt con ruột và con nuôi</li>
          <li><strong>Kết quả:</strong> Xác định rõ tình trạng, áp dụng đúng quy định pháp luật về thừa kế</li>
        </ul>

        <h2 id="8">Kinh nghiệm thực tế từ các vụ việc</h2>
        <p>Từ kinh nghiệm xử lý hàng nghìn vụ việc tranh chấp thừa kế, xét nghiệm ADN đã chứng minh hiệu quả cao trong việc giải quyết các tranh chấp.</p>
        
        <p><strong>Thống kê thành công:</strong></p>
        <ul>
          <li><strong>Tỷ lệ giải quyết:</strong> 95% các vụ việc được giải quyết dứt điểm</li>
          <li><strong>Thời gian rút ngắn:</strong> Giảm 60-70% thời gian xử lý so với phương pháp truyền thống</li>
          <li><strong>Chi phí tiết kiệm:</strong> Giảm 40-50% chi phí tố tụng tổng thể</li>
          <li><strong>Độ hài lòng:</strong> 90% các bên hài lòng với kết quả</li>
        </ul>
        
        <p><strong>Bài học kinh nghiệm:</strong></p>
        <ul>
          <li><strong>Thực hiện sớm:</strong> Càng sớm thực hiện xét nghiệm càng tốt, tránh kéo dài tranh chấp</li>
          <li><strong>Chuẩn bị kỹ:</strong> Chuẩn bị đầy đủ giấy tờ và tâm lý trước khi thực hiện</li>
          <li><strong>Chọn đơn vị uy tín:</strong> Lựa chọn trung tâm có kinh nghiệm và uy tín</li>
          <li><strong>Tư vấn pháp lý:</strong> Luôn có luật sư tư vấn trong suốt quá trình</li>
          <li><strong>Tôn trọng kết quả:</strong> Chấp nhận và tôn trọng kết quả khoa học</li>
        </ul>
        
        <p><strong>Những lưu ý từ thực tế:</strong></p>
        <ul>
          <li><strong>Mẫu chất lượng kém:</strong> 5-10% trường hợp cần lấy mẫu lại do chất lượng không đạt</li>
          <li><strong>Tranh chấp kết quả:</strong> 2-3% trường hợp có tranh cãi về kết quả, cần giải thích kỹ</li>
          <li><strong>Vấn đề tâm lý:</strong> 15-20% trường hợp gặp khó khăn về mặt tâm lý</li>
          <li><strong>Chi phí phát sinh:</strong> 10-15% trường hợp có chi phí phát sinh do yêu cầu đặc biệt</li>
        </ul>
        
        <p><strong>Khuyến nghị cho tương lai:</strong></p>
        <ul>
          <li><strong>Nâng cao nhận thức:</strong> Tuyên truyền để người dân hiểu rõ về xét nghiệm ADN</li>
          <li><strong>Hoàn thiện pháp luật:</strong> Bổ sung quy định cụ thể về xét nghiệm ADN trong thừa kế</li>
          <li><strong>Đào tạo nhân lực:</strong> Tăng cường đào tạo chuyên gia pháp y và luật sư</li>
          <li><strong>Phát triển công nghệ:</strong> Đầu tư vào công nghệ mới để nâng cao chất lượng</li>
          <li><strong>Hỗ trợ người nghèo:</strong> Mở rộng chính sách hỗ trợ cho người có hoàn cảnh khó khăn</li>
        </ul>
        
        <div class="conclusion-box">
          <h3>Kết luận</h3>
          <p>Xét nghiệm ADN đã và đang đóng vai trò quan trọng trong việc giải quyết các tranh chấp thừa kế, mang lại công bằng và minh bạch cho hệ thống tư pháp. Với sự phát triển của khoa học công nghệ, xét nghiệm ADN sẽ tiếp tục là công cụ đáng tin cậy giúp bảo vệ quyền lợi hợp pháp của các bên và xây dựng xã hội công bằng, văn minh.</p>
          
          <p>Để đạt hiệu quả cao nhất, các bên cần lựa chọn đơn vị thực hiện uy tín, chuẩn bị đầy đủ giấy tờ, tuân thủ đúng quy trình và luôn có sự tư vấn của luật sư chuyên nghiệp. Điều này không chỉ đảm bảo kết quả chính xác mà còn bảo vệ quyền lợi và danh tiếng của tất cả các bên liên quan.</p>
        </div>
      </div>
    `
  },


  {
    id: 5,
    title: "Giải Mã Sự Sống: Nguyên Lý Hoạt Động Của Xét Nghiệm ADN",
    category: "Kiến Thức",
    excerpt: "Khám phá nguyên lý khoa học đằng sau xét nghiệm ADN - công cụ mạnh mẽ giúp 'đọc' bản thiết kế độc nhất vô nhị của mỗi người với độ chính xác đến kinh ngạc.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=800&fit=crop",
    slug: "nguyen-ly-hoat-dong-cua-xet-nghiem-adn",
    author: "GS. Vũ Thanh Sơn",
    date: "2024-01-18",
    readTime: "15 phút đọc",
    featured: true,
    views: 1650,
    likes: 124,
    comments: 31,
    tableOfContents: [
      { id: "1", title: "ADN: 'Bản Thiết Kế' Di Truyền Của Bạn", level: 1 },
      { id: "2", title: "Quy Trình 'Đọc' ADN: Từ Mẫu Sinh Học Đến Kết Quả", level: 1 },
      { id: "3", title: "Thu Thập Mẫu Sinh Học", level: 1 },
      { id: "4", title: "Tách Chiết ADN", level: 1 },
      { id: "5", title: "Khuếch Đại Đoạn Gen Mục Tiêu (PCR)", level: 1 },
      { id: "6", title: "Phân Tích Kích Thước Các Đoạn ADN", level: 1 },
      { id: "7", title: "So Sánh và Đánh Giá Kết Quả", level: 1 },
      { id: "8", title: "Độ Chính Xác và Giá Trị Pháp Lý", level: 1 },
      { id: "9", title: "Tương Lai Của Công Nghệ ADN", level: 1 },
      { id: "10", title: "Hướng Dẫn Cho Người Dân", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <p class="lead-paragraph">Xét nghiệm ADN đã trở thành một công cụ mạnh mẽ trong nhiều lĩnh vực, từ pháp y đến xác định quan hệ huyết thống. Nhưng làm thế nào mà khoa học có thể "đọc" được bản thiết kế độc nhất vô nhị của mỗi người? Hãy cùng tìm hiểu nguyên lý cơ bản đằng sau những kết quả chính xác đến kinh ngạc này.</p>
        
        <h2 id="1">ADN: "Bản Thiết Kế" Di Truyền Của Bạn</h2>
        <p>Trong hầu hết mọi tế bào của cơ thể, chúng ta đều mang một chuỗi phân tử phức tạp gọi là <strong>ADN (axit deoxyribonucleic)</strong>. ADN là bản đồ di truyền cá nhân, chứa đựng thông tin quy định mọi đặc điểm của bạn.</p>
        
        <p><strong>Cấu trúc ADN:</strong></p>
        <ul>
          <li><strong>Chuỗi xoắn kép:</strong> ADN có cấu trúc như một chiếc thang xoắn ốc</li>
          <li><strong>Bốn "chữ cái" hóa học:</strong>
            <ul>
              <li>Adenine (A)</li>
              <li>Thymine (T)</li>
              <li>Guanine (G)</li>
              <li>Cytosine (C)</li>
            </ul>
          </li>
          <li><strong>Trật tự sắp xếp riêng biệt:</strong> Chính trình tự của các chữ cái này tạo nên mã di truyền độc nhất của mỗi cá thể</li>
        </ul>
        
        <p><strong>Short Tandem Repeats (STRs) - "Dấu vân tay" di truyền:</strong></p>
        <p>Điều đặc biệt là, mặc dù phần lớn ADN của con người giống nhau, có những đoạn ngắn được lặp đi lặp lại nhiều lần với số lượng khác nhau giữa mỗi người. Chúng được gọi là <strong>Short Tandem Repeats (STRs)</strong> – và đây chính là "dấu vân tay" di truyền mà các xét nghiệm ADN hiện đại tập trung vào.</p>

        <h2 id="2">Quy Trình "Đọc" ADN: Từ Mẫu Sinh Học Đến Kết Quả</h2>
        <p>Về cơ bản, xét nghiệm ADN là quá trình so sánh các đoạn STRs cụ thể giữa các cá thể. Những đoạn này được di truyền từ cả cha và mẹ, mang tính đặc trưng cao, giúp chúng trở thành chỉ dấu hoàn hảo cho việc xác định mối quan hệ.</p>
        
        <p>Quy trình xét nghiệm ADN thường bao gồm các bước chính sau:</p>

        <h2 id="3">1. Thu Thập Mẫu Sinh Học</h2>
        <p>Bước đầu tiên là lấy mẫu có chứa tế bào và ADN. Các mẫu phổ biến nhất là:</p>
        
        <p><strong>Mẫu niêm mạc miệng (nước bọt):</strong></p>
        <ul>
          <li>An toàn, không xâm lấn và dễ thu thập</li>
          <li>Sử dụng tăm bông chuyên dụng cọ xát vào mặt trong má</li>
          <li>Phương pháp được ưa chuộng nhất hiện nay</li>
        </ul>
        
        <p><strong>Mẫu máu:</strong></p>
        <ul>
          <li>Thường dùng cho các trường hợp đặc biệt</li>
          <li>Khi cần lượng ADN lớn hơn</li>
          <li>Độ tin cậy cao</li>
        </ul>
        
        <p><strong>Các mẫu khác:</strong></p>
        <ul>
          <li>Tóc (phải có chân tóc)</li>
          <li>Móng tay</li>
          <li>Các dấu vết sinh học tại hiện trường vụ án</li>
        </ul>
        
        <div class="important-note">
          <p><strong>Lưu ý quan trọng:</strong> Đối với xét nghiệm có giá trị pháp lý, việc lấy mẫu cần được thực hiện bởi nhân viên chuyên môn, có người chứng kiến và lập biên bản.</p>
        </div>

        <h2 id="4">2. Tách Chiết ADN</h2>
        <p>Mẫu thu được sẽ trải qua quá trình tách chiết để loại bỏ các thành phần khác, chỉ giữ lại ADN tinh khiết, sẵn sàng cho phân tích.</p>
        
        <p><strong>Quy trình tách chiết:</strong></p>
        <ul>
          <li>Phá vỡ màng tế bào để giải phóng ADN</li>
          <li>Loại bỏ protein và các tạp chất</li>
          <li>Tinh chế ADN đạt độ sạch cao</li>
          <li>Kiểm tra chất lượng và nồng độ ADN</li>
        </ul>

        <h2 id="5">3. Khuếch Đại Đoạn Gen Mục Tiêu (PCR)</h2>
        <p>Vì lượng ADN trong mẫu thường rất ít, kỹ thuật <strong>Phản ứng chuỗi Polymerase (PCR)</strong> sẽ được sử dụng. PCR như một "máy photocopy" gen, tạo ra hàng triệu bản sao của các đoạn STRs cần phân tích, giúp chúng ta có đủ lượng ADN để nghiên cứu.</p>
        
        <p><strong>Nguyên lý hoạt động của PCR:</strong></p>
        <ul>
          <li><strong>Biến tính (Denaturation):</strong> Tách đôi chuỗi ADN bằng nhiệt độ cao (94-96°C)</li>
          <li><strong>Gắn mồi (Annealing):</strong> Các mồi đặc hiệu gắn vào vùng đích (50-65°C)</li>
          <li><strong>Kéo dài (Extension):</strong> Enzyme DNA polymerase tổng hợp chuỗi mới (72°C)</li>
          <li><strong>Lặp lại:</strong> Chu kỳ được lặp lại 25-35 lần</li>
        </ul>
        
        <p>Sau quá trình PCR, số lượng ADN đích tăng lên theo cấp số nhân, từ vài phân tử ban đầu thành hàng triệu bản sao.</p>

        <h2 id="6">4. Phân Tích Kích Thước Các Đoạn ADN</h2>
        <p>Sau khi khuếch đại, các đoạn STRs này sẽ có chiều dài khác nhau. <strong>Công nghệ điện di mao quản</strong> sẽ tách và đo chính xác kích thước của từng đoạn STR. Mỗi đoạn sẽ phát ra tín hiệu riêng, tạo thành một "biểu đồ gen" độc đáo.</p>
        
        <p><strong>Quy trình điện di mao quản:</strong></p>
        <ul>
          <li>Các đoạn ADN được đánh dấu bằng chất huỳnh quang</li>
          <li>Di chuyển qua ống mao quản siêu mỏng</li>
          <li>Phân tách theo kích thước - đoạn nhỏ di chuyển nhanh hơn</li>
          <li>Detector laser đọc tín hiệu huỳnh quang</li>
          <li>Tạo ra electropherogram (biểu đồ điện di)</li>
        </ul>

        <h2 id="7">5. So Sánh và Đánh Giá Kết Quả</h2>
        <p>Dữ liệu từ biểu đồ gen được chuyển thành hồ sơ ADN số hóa.</p>
        
        <p><strong>Với xét nghiệm huyết thống:</strong></p>
        <ul>
          <li>Hồ sơ ADN của người con được so sánh với hồ sơ của cha và mẹ giả định</li>
          <li>Vì con nhận một nửa gen từ cha và một nửa từ mẹ</li>
          <li>Nếu có quan hệ, các đoạn STRs của con phải trùng khớp với của cha tại tất cả các vị trí đã kiểm tra</li>
          <li>Thường phân tích 15-20 vị trí STR khác nhau</li>
        </ul>
        
        <p><strong>Với pháp y:</strong></p>
        <ul>
          <li>Hồ sơ ADN từ hiện trường được đối chiếu với dữ liệu nghi phạm</li>
          <li>So sánh với ngân hàng ADN để tìm kiếm sự trùng khớp</li>
          <li>Tính toán xác suất trùng ngẫu nhiên</li>
        </ul>
        
        <p><strong>Vai trò của AI và Machine Learning:</strong></p>
        <p>Ngày nay, <strong>Trí tuệ Nhân tạo (AI)</strong> và <strong>Học máy (Machine Learning)</strong> hỗ trợ đắc lực trong việc phân tích lượng dữ liệu khổng lồ này, giúp:</p>
        <ul>
          <li>Tăng tốc độ xử lý dữ liệu</li>
          <li>Nâng cao độ chính xác phân tích</li>
          <li>Giảm thiểu sai sót do con người</li>
          <li>Phát hiện các pattern phức tạp</li>
          <li>Tự động hóa quy trình đánh giá</li>
        </ul>

        <h2 id="8">Độ Chính Xác và Giá Trị Pháp Lý</h2>
        <p>Khi được thực hiện tại các phòng thí nghiệm đạt chuẩn quốc tế, xét nghiệm ADN mang lại độ chính xác cực cao:</p>
        
        <p><strong>Tiêu chuẩn chất lượng:</strong></p>
        <ul>
          <li><strong>ISO 17025:</strong> Tiêu chuẩn năng lực phòng thí nghiệm</li>
          <li><strong>AABB:</strong> Hiệp hội Ngân hàng Máu Hoa Kỳ</li>
          <li><strong>CAP:</strong> Trường Cao đẳng Bác sĩ Giải phẫu bệnh Hoa Kỳ</li>
        </ul>
        
        <p><strong>Độ chính xác:</strong></p>
        <ul>
          <li><strong>Có quan hệ:</strong> Độ chính xác thường đạt 99.99% hoặc hơn</li>
          <li><strong>Không có quan hệ:</strong> Khẳng định loại trừ với độ chính xác 100%</li>
          <li><strong>Xác suất cha:</strong> Thường > 99.9% khi có quan hệ</li>
          <li><strong>Chỉ số kết hợp (CI):</strong> Thường > 10,000</li>
        </ul>
        
        <p><strong>Giá trị pháp lý:</strong></p>
        <p>Chính vì độ tin cậy vượt trội này, kết quả xét nghiệm ADN có giá trị pháp lý rất cao, được chấp nhận rộng rãi trong:</p>
        <ul>
          <li>Các thủ tục tư pháp</li>
          <li>Thủ tục hành chính</li>
          <li>Tranh chấp dân sự</li>
          <li>Điều tra hình sự</li>
          <li>Thủ tục xuất nhập cảnh</li>
        </ul>

        <h2 id="9">Tương Lai Của Công Nghệ ADN</h2>
        <p>Công nghệ xét nghiệm ADN đang không ngừng tiến bộ, với các kỹ thuật tiên tiến đang được phát triển:</p>
        
        <p><strong>Giải trình tự Thế hệ Mới (NGS):</strong></p>
        <ul>
          <li>Phân tích toàn bộ hệ gen chi tiết hơn</li>
          <li>Giảm chi phí và thời gian xử lý</li>
          <li>Tăng độ phân giải và độ chính xác</li>
          <li>Khả năng phân tích mẫu degraded</li>
        </ul>
        
        <p><strong>Ứng dụng mới:</strong></p>
        <ul>
          <li><strong>Y học cá thể hóa:</strong> Điều trị dựa trên đặc điểm di truyền cá nhân</li>
          <li><strong>Chẩn đoán bệnh sớm:</strong> Phát hiện nguy cơ mắc bệnh di truyền</li>
          <li><strong>Dược lý di truyền:</strong> Lựa chọn thuốc phù hợp với từng người</li>
          <li><strong>Nghiên cứu tiến hóa:</strong> Tìm hiểu lịch sử di truyền loài người</li>
        </ul>
        
        <p><strong>Công nghệ mới nổi:</strong></p>
        <ul>
          <li>Portable DNA sequencing (giải trình tự ADN di động)</li>
          <li>Real-time PCR với độ nhạy cao hơn</li>
          <li>Microfluidics cho xét nghiệm nhanh</li>
          <li>Blockchain để bảo mật dữ liệu di truyền</li>
        </ul>

        <h2 id="10">Hướng Dẫn Cho Người Dân</h2>
        <p><strong>Khi nào nên thực hiện xét nghiệm ADN:</strong></p>
        <ul>
          <li>Xác định quan hệ huyết thống cho mục đích cá nhân</li>
          <li>Giải quyết tranh chấp pháp lý về thừa kế</li>
          <li>Thủ tục nhận con nuôi hoặc xác nhận cha con</li>
          <li>Hỗ trợ thủ tục xuất nhập cảnh</li>
          <li>Mục đích y tế (ghép tạng, chẩn đoán bệnh di truyền)</li>
        </ul>
        
        <p><strong>Lựa chọn cơ sở xét nghiệm uy tín:</strong></p>
        <ul>
          <li>Có giấy phép hoạt động của Bộ Y tế</li>
          <li>Được chứng nhận bởi các tổ chức quốc tế (ISO, AABB, CAP)</li>
          <li>Có đội ngũ chuyên gia giàu kinh nghiệm</li>
          <li>Sử dụng công nghệ và thiết bị hiện đại</li>
          <li>Có chính sách bảo mật thông tin rõ ràng</li>
          <li>Cung cấp dịch vụ tư vấn chuyên nghiệp</li>
        </ul>
        
        <p><strong>Chuẩn bị trước khi xét nghiệm:</strong></p>
        <ul>
          <li>Tìm hiểu về quy trình và chi phí</li>
          <li>Chuẩn bị đầy đủ giấy tờ cần thiết</li>
          <li>Thảo luận với các bên liên quan</li>
          <li>Hiểu rõ ý nghĩa và hậu quả của kết quả</li>
          <li>Lựa chọn loại xét nghiệm phù hợp với mục đích</li>
        </ul>
        
        <p><strong>Sau khi có kết quả:</strong></p>
        <ul>
          <li>Yêu cầu giải thích chi tiết từ chuyên gia</li>
          <li>Bảo quản kết quả cẩn thận</li>
          <li>Sử dụng kết quả đúng mục đích</li>
          <li>Tôn trọng quyền riêng tư của các bên liên quan</li>
        </ul>
        
        <div class="conclusion-box">
          <h3>Kết luận</h3>
          <p>Hiểu rõ nguyên lý hoạt động của xét nghiệm ADN giúp chúng ta đánh giá đúng vai trò và tiềm năng của công nghệ này trong việc giải mã những bí ẩn của sự sống và phục vụ cộng đồng. Với sự phát triển không ngừng của khoa học công nghệ, xét nghiệm ADN sẽ tiếp tục đóng góp quan trọng vào việc nâng cao chất lượng cuộc sống và xây dựng xã hội công bằng, văn minh.</p>
        </div>
      </div>
    `
  },
// ... existing code ...
  {
    id: 6,
    title: "Thủ Tục Đăng Ký Xét Nghiệm ADN Online",
    category: "Hành Chính",
    excerpt: "Hướng dẫn đăng ký xét nghiệm ADN trực tuyến nhanh chóng, tiện lợi qua hệ thống điện tử của Bộ Y tế.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
    slug: "thu-tuc-dang-ky-xet-nghiem-adn-online",
    author: "Chuyên viên Nguyễn Văn Đức",
    date: "2024-01-16",
    readTime: "7 phút đọc",
    featured: false,
    views: 1320,
    likes: 89,
    comments: 22,
    tableOfContents: [
      { id: "1", title: "Hệ thống đăng ký online", level: 1 },
      { id: "2", title: "Các bước thực hiện", level: 1 },
      { id: "3", title: "Thanh toán trực tuyến", level: 1 },
      { id: "4", title: "Theo dõi tiến độ", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <h2 id="1">Hệ thống đăng ký online</h2>
        <p>Hệ thống đăng ký xét nghiệm ADN trực tuyến của Bộ Y tế cho phép người dân thực hiện các thủ tục một cách nhanh chóng và tiện lợi.</p>
        
        <h2 id="2">Các bước thực hiện</h2>
        <p>Quy trình đăng ký gồm 5 bước đơn giản:</p>
        <ul>
          <li>Đăng ký tài khoản trên hệ thống</li>
          <li>Điền thông tin cá nhân</li>
          <li>Upload giấy tờ cần thiết</li>
          <li>Chọn địa điểm lấy mẫu</li>
          <li>Xác nhận và thanh toán</li>
        </ul>
        
        <h2 id="3">Thanh toán trực tuyến</h2>
        <p>Hệ thống hỗ trợ nhiều hình thức thanh toán: thẻ ATM, ví điện tử, chuyển khoản ngân hàng.</p>
        
        <h2 id="4">Theo dõi tiến độ</h2>
        <p>Khách hàng có thể theo dõi tiến độ xử lý hồ sơ và nhận kết quả qua SMS hoặc email.</p>
      </div>
    `
  },
  {
    id: 7,
    title: "Cập Nhật: Giá Xét Nghiệm ADN Giảm 30% Trong Tháng 2",
    category: "Tin Tức",
    excerpt: "Tin vui cho người dân khi các trung tâm xét nghiệm ADN đồng loạt giảm giá dịch vụ trong tháng 2/2024.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop",
    slug: "cap-nhat-gia-xet-nghiem-adn-giam-30-trong-thang-2",
    author: "Phóng viên Hoàng Minh Tuấn",
    date: "2024-01-15",
    readTime: "4 phút đọc",
    featured: false,
    views: 1890,
    likes: 134,
    comments: 28,
    tableOfContents: [
      { id: "1", title: "Thông tin giảm giá", level: 1 },
      { id: "2", title: "Điều kiện áp dụng", level: 1 },
      { id: "3", title: "Cách thức đăng ký", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <h2 id="1">Thông tin giảm giá</h2>
        <p>Từ ngày 1/2/2024, các trung tâm xét nghiệm ADN trên toàn quốc đồng loạt giảm giá dịch vụ 30% nhằm hỗ trợ người dân tiếp cận dễ dàng hơn.</p>
        
        <h2 id="2">Điều kiện áp dụng</h2>
        <p>Chương trình áp dụng cho tất cả các loại xét nghiệm ADN, không giới hạn số lượng, áp dụng đến hết tháng 2/2024.</p>
        
        <h2 id="3">Cách thức đăng ký</h2>
        <p>Khách hàng có thể đăng ký trực tiếp tại các trung tâm hoặc qua hệ thống online để được hưởng ưu đãi.</p>
      </div>
    `
  },
  {
    id: 8,
    title: "Quyền Lợi Pháp Lý Khi Thực Hiện Xét Nghiệm ADN",
    category: "Dân Sự",
    excerpt: "Tìm hiểu về các quyền lợi và nghĩa vụ pháp lý của các bên khi tham gia xét nghiệm ADN theo luật hiện hành.",
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1200&h=800&fit=crop",
    slug: "quyen-loi-phap-ly-khi-thuc-hien-xet-nghiem-adn",
    author: "Luật sư Đỗ Thị Mai",
    date: "2024-01-12",
    readTime: "9 phút đọc",
    featured: false,
    views: 1150,
    likes: 78,
    comments: 19,
    tableOfContents: [
      { id: "1", title: "Quyền của người tham gia", level: 1 },
      { id: "2", title: "Nghĩa vụ pháp lý", level: 1 },
      { id: "3", title: "Bảo vệ quyền riêng tư", level: 1 },
      { id: "4", title: "Xử lý tranh chấp", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <h2 id="1">Quyền của người tham gia</h2>
        <p>Người tham gia xét nghiệm ADN có quyền được thông báo đầy đủ về mục đích, quy trình và hậu quả của việc xét nghiệm.</p>
        
        <h2 id="2">Nghĩa vụ pháp lý</h2>
        <p>Các bên có nghĩa vụ cung cấp thông tin chính xác, hợp tác trong quá trình lấy mẫu và tuân thủ các quy định pháp luật.</p>
        
        <h2 id="3">Bảo vệ quyền riêng tư</h2>
        <p>Thông tin ADN được bảo mật nghiêm ngặt và chỉ được sử dụng cho mục đích đã thỏa thuận.</p>
        
        <h2 id="4">Xử lý tranh chấp</h2>
        <p>Trong trường hợp có tranh chấp, các bên có thể khiếu nại hoặc khởi kiện theo quy định của pháp luật.</p>
      </div>
    `
  },
  {
    id: 9,
    title: "Ứng Dụng AI Trong Phân Tích Kết Quả ADN",
    category: "Kiến Thức",
    excerpt: "Công nghệ trí tuệ nhân tạo đang cách mạng hóa việc phân tích và xử lý kết quả xét nghiệm ADN.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop",
    slug: "ung-dung-ai-trong-phan-tich-ket-qua-adn",
    author: "TS. Lê Minh Hải",
    date: "2024-01-10",
    readTime: "11 phút đọc",
    featured: false,
    views: 1420,
    likes: 95,
    comments: 26,
    tableOfContents: [
      { id: "1", title: "AI trong xét nghiệm ADN", level: 1 },
      { id: "2", title: "Thuật toán machine learning", level: 1 },
      { id: "3", title: "Ưu điểm của AI", level: 1 },
      { id: "4", title: "Tương lai của công nghệ", level: 1 }
    ],
    content: `
      <div class="blog-content">
        <h2 id="1">AI trong xét nghiệm ADN</h2>
        <p>Trí tuệ nhân tạo đang được ứng dụng rộng rãi trong việc phân tích dữ liệu ADN, giúp tăng độ chính xác và giảm thời gian xử lý.</p>
        
        <h2 id="2">Thuật toán machine learning</h2>
        <p>Các thuật toán học máy được huấn luyện trên hàng triệu mẫu dữ liệu ADN để nhận diện các pattern và đưa ra kết luận chính xác.</p>
        
        <h2 id="3">Ưu điểm của AI</h2>
        <p>AI mang lại nhiều ưu điểm:</p>
        <ul>
          <li>Tăng độ chính xác lên 99.99%</li>
          <li>Giảm thời gian phân tích từ ngày xuống giờ</li>
          <li>Phát hiện các mối quan hệ phức tạp</li>
          <li>Giảm thiểu sai sót do con người</li>
        </ul>
        
        <h2 id="4">Tương lai của công nghệ</h2>
        <p>Trong tương lai, AI sẽ tiếp tục phát triển và có thể dự đoán được nhiều thông tin di truyền khác từ mẫu ADN.</p>
      </div>
    `
  }
];

const BlogDetail = () => {
  const { slug } = useParams();
  const [activeSection, setActiveSection] = useState('1');
  
  // Tìm bài viết theo slug
  const article = articles.find(a => a.slug === slug);
  
  // Nếu không tìm thấy bài viết, chuyển hướng về trang blog
  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1>
          <Link to="/blog" className="text-blue-600 hover:text-blue-800">Quay lại trang Blog</Link>
        </div>
      </div>
    );
  }

  // Lấy bài viết liên quan (cùng category, khác id)
  const relatedArticles = articles
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600 flex items-center">
              <FaHome className="mr-1" />
              Trang chủ
            </Link>
            <FaChevronRight className="text-gray-400" />
            <Link to="/blog" className="hover:text-blue-600">Blog</Link>
            <FaChevronRight className="text-gray-400" />
            <span className="text-gray-800 font-medium">{article.category}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Article Header */}
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Article Meta */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${
                    article.category === 'Kiến Thức' ? 'from-green-500 to-green-600' :
                    article.category === 'Hành Chính' ? 'from-red-500 to-red-600' :
                    article.category === 'Tin Tức' ? 'from-purple-500 to-purple-600' :
                    'from-orange-500 to-orange-600'
                  }`}>
                    <FaTag className="inline mr-1" />
                    {article.category}
                  </span>
                  {article.featured && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ⭐ Nổi bật
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {article.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <FaUser className="mr-2 text-blue-500" />
                    <span className="font-medium">{article.author}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendar className="mr-2 text-blue-500" />
                    <span>{formatDate(article.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-blue-500" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="px-6">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-96 object-cover rounded-xl"
                />
              </div>

              {/* Article Content */}
              <div className="p-6">
                <div 
                  className="prose prose-lg max-w-none blog-content"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Bài viết liên quan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Link 
                      key={relatedArticle.id}
                      to={`/blog/${relatedArticle.slug}`}
                      className="group block bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <img
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white mb-2 ${
                          relatedArticle.category === 'Kiến Thức' ? 'bg-green-500' :
                          relatedArticle.category === 'Hành Chính' ? 'bg-red-500' :
                          relatedArticle.category === 'Tin Tức' ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`}>
                          {relatedArticle.category}
                        </span>
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {relatedArticle.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedArticle.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <span>{relatedArticle.author}</span>
                          <span>{relatedArticle.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Table of Contents */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-3">
                📋 Nội dung:
              </h3>
              <nav className="space-y-2">
                {article.tableOfContents?.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === item.id 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${
                      item.level === 2 ? 'ml-4 text-sm' : ''
                    }`}
                  >
                    {item.level === 1 ? `${item.id}. ` : `${item.id} `}
                    {item.title}
                  </button>
                ))}
              </nav>
              
              {/* Back to Blog */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link 
                  to="/blog" 
                  className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold"
                >
                  <FaArrowLeft className="mr-2" />
                  Quay lại Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .blog-content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          color: #1f2937;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .blog-content h3 {
          font-size: 1.375rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #374151;
        }
        
        .blog-content p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
          color: #4b5563;
          text-align: justify;
        }
        
        .blog-content ul, .blog-content ol {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }
        
        .blog-content li {
          margin-bottom: 0.75rem;
          color: #4b5563;
          line-height: 1.7;
        }
        
        .blog-content strong {
          color: #1f2937;
          font-weight: 600;
        }
        
        .blog-content ul li {
          position: relative;
        }
        
        .blog-content ul li::before {
          content: "•";
          color: #3b82f6;
          font-weight: bold;
          position: absolute;
          left: -1.5rem;
        }
        
        .prose {
          max-width: none;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;