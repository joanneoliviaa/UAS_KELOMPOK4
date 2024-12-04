Query Table untuk Pengujian Website :
- users :
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
- media_content :
  CREATE TABLE media_content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    season VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
- comments :
  CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  season VARCHAR(50) NOT NULL,
  media_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) );
- products :
  CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255) NOT NULL
);
- cart :
  CREATE TABLE cart (
  user_id INT,
  product_id INT,
  quantity INT DEFAULT 1,
  PRIMARY KEY (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
  );
- news :
  CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100) NOT NULL,
  full_article TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );

Query Insert Data :
- media_content :
  INSERT INTO media_content (title, description, url, season) VALUES 
  ('Autumn Leaves', 'A beautiful autumn scenery.', '"https://www.stylingoutfits.com/wp-content/uploads/2024/06/Autumn-Fashion.jpg"', 'autumn'),
  ('Golden Autumn', 'Golden leaves covering the ground.', '"https://fashionbylina.com/wp-content/uploads/2024/08/Fall-outfits-for-moms-2.jpg"', 'autumn'),
  ('Winter Wonderland', 'Snow-covered mountains and a cozy cabin.', 'https://elegantlivingeveryday.com/wp-content/uploads/2024/01/Winter-Fashion-Featured-Image.jpg', 'winter'),
  ('Frosty Morning', 'A frosty morning view in the countryside.', 'https://witwhimsy.com/wp-content/uploads/2022/09/winter-coat-ball-cap-leather-pants-fall-paris-outfit.jpg', 'winter'),
  ('Spring Blossoms', 'Cherry blossoms in full bloom.', 'https://awsimages.detik.net.id/community/media/visual/2020/09/15/fashion-show-jason-wu-spring-202-1.jpeg?w=2512', 'spring'),
  ('Tulip Fields', 'Colorful tulip fields under a blue sky.', 'https://www.refinery29.com/images/10954585.jpg?format=webp&width=720&height=864&quality=85g', 'spring'),
  ('Summer Vibes', 'A sunny beach with clear blue water.', 'https://media.glamour.com/photos/5695872c5fff94d44eec6931/master/w_1500,h_2250,c_limit/fashion-2014-05-07-white-main.jpg', 'summer'),
  ('Tropical Paradise', 'A tropical island surrounded by turquoise water.', 'https://cdn.shopify.com/s/files/1/0853/2741/3543/files/Melbourne_Summer_Fashion_Infinite_Fashion_480x480.png?v=1725601045', 'summer');
- products :
  INSERT INTO products (name, description, price, image_url) VALUES
('Stylish Shirt', 'This stylish shirt is perfect for both casual and semi-formal occasions. Made from high-quality cotton, it provides comfort and style.', 25.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKq_K-X7VcJNRLdJLmu9OvFjg_6-uIHYTOOw&s'),
('Elegant Summer Dress', 'A beautiful summer dress, perfect for sunny days or evening occasions. Light, breathable fabric for a relaxed yet elegant look.', 40.00, 'https://image.made-in-china.com/2f0j00MFBihVfGAvgj/Summer-Maxi-Dress-Short-Flare-Sleeves-V-Neck-Elegant-Dress-with-Sashes-A-Line-Printed-Breathable-Casual-Dresses.webp'),
('Cute Floral Dress', 'Embrace the charm of spring with this floral print dress. Featuring a deep V-neck and a flowy design, perfect for a beach day or casual gathering.', 30.00, 'https://image.made-in-china.com/2f0j00wFdhzgkPwjpy/Floral-Print-Fashion-Summer-Deep-V-Neck-Drape-Long-Women-Dress-Maxi-Chiffon-Casual-Dress-Elegant-Beach-Bohemian-Ladies-Dresses.webp'),
('Denim Jacket', 'Classic denim jacket that never goes out of style. Perfect for layering, offering a timeless, casual-chic look for any season.', 38.00, 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//catalog-image/96/MTA-143117187/br-m036969-19421_-pre-order-3second-x-karafuru-denim-jacket-logo-script-grouphis-c051223_full01-06698e8e.jpg'),
('Urban T-Shirt', 'Stay stylish and comfortable with this urban-inspired T-shirt. Crafted from soft cotton.', 35.00, 'https://i0.wp.com/parweld.com/wp-content/uploads/2023/04/35750-755_ENJOY_Front.png?fit=800%2C800&ssl=1'),
('Sporty Pants', 'Durable and comfortable sporty pants for your active lifestyle. Suitable for workouts or casual wear, with an athletic fit for ease of movement.', 35.00, 'https://img.ncrsport.com/img/storage/large/DV1548-1.jpg'),
('Classic Leather Jacket', 'This iconic leather jacket is the epitome of edgy style. Featuring a sleek design with durable material, it’s perfect for a bold, confident look.', 75.00, 'https://bikerslifestyle.co/cdn/shop/files/dachinh_4912534e-7e3d-4d74-8b51-9c16f7624a0f.jpg?v=1709710313'),
('Cozy Knit Sweater', 'A cozy knit sweater for chilly days. Soft, comfortable, and warm, it’s a must-have for a stylish winter wardrobe.', 50.00, 'https://www.jacwardrobe.com/cdn/shop/files/cozy-kids-round-neck-knit-sweater-991385.jpg?v=1719487883&width=800'),
('Chic High-Waisted Trousers', 'Elegant high-waisted trousers, perfect for both work and leisure. The flattering fit and classic design make it a versatile wardrobe staple.', 55.00, 'https://ae01.alicdn.com/kf/S8e56858f0c574f3496c54ffeb922d986w/High-Waist-Suits-Pants-Loose-Wide-Leg-Pants-for-Women-Chic-Vintage-Office-Lady-Long-Trousers.jpg'),
('Trendy Fashion Sneakers', 'These trendy sneakers offer a perfect blend of comfort and fashion. Ideal for casual outings or an athleisure look, with a stylish modern touch.', 60.00, 'https://img.lazcdn.com/g/p/63096ec78c3a22189544cbb359eda7a7.jpg_960x960q80.jpg_.webp'),
('Elegant Evening Gown', 'A stunning evening gown, perfect for special occasions. Designed with intricate details to make you stand out, exuding grace and elegance.', 120.00, 'https://sandrasbridalcollection.com/cdn/shop/products/S23f3a47da2df4c909f5e83ee9a4edb7ds_800x.jpg?v=1678844149'),
('Graphic Print T-Shirt', 'Express your personality with this graphic print T-shirt. Made from soft, breathable cotton, it’s perfect for casual everyday wear.', 20.00, 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//catalog-image/100/MTA-148317382/br-m036969-01338_greenlight-men-s-t-shirt-short-sleeve-cotton-logo-script-ol-c281223_full01-881ab8c3.jpg');
- news :
  INSERT INTO news (title, author, full_article, image_url, created_at)
VALUES 
('Best Front Row Style From New York Fashion Week', 'Christian Allaire', 'And we’re off to the races! New York Fashion Week has officially kicked off, and all week long, designers will be unveiling their new spring 2025 collections in the city that never sleeps. Just as captivating as the designs that will hit the runway, however, are the celebrity sighting in the front row New York Fashion Week always delivers.

Just last season, celebs like Chloë Sevigny, Danai Gurira, Alexa Chung, and Katie Holmes were spotted wearing stylish looks from their prime VIP seats. Seeing which stars come out—and getting a glimpse of what they decide to wear—is half the fun of showing up to a presentation, no? Its a prime opportunity for star gazing Below, see the best front-row looks thus far, and check back for more as well be updating our stylish sightings in real time.', 'https://assets.vogue.com/photos/66e06853c6806a74745d4a5a/16:9/w_1920%2Cc_limit/GettyImages-2171073041.jpg', CURRENT_TIMESTAMP),
('All Aboard the U.S.S. SNL for Tommy Hilfiger', 'Hannah Jackson', 'One man’s $280,100 money pit is another’s ideal fashion show venue! Tonight, for his spring 2025 show, Tommy Hilfiger brought guests aboard New York’s hottest club, the decommissioned Staten Island Ferry, which was recently purchased by SNL’s Colin Jost and alum Pete Davidson. (“Hey man, is this your boat?” one attendee asked Jost shortly before the show began.)','https://assets.vogue.com/photos/66de4a682ba99449ac3dd549/master/w_1600,c_limit/2170269505', CURRENT_TIMESTAMP),
('My (Brief) Life as a Show Dog for Rachel Antonoff and Susan Alexandra', 'Magnolia', 'People think we are color blind. This is not so. Canines can, in fact, see color; we have two cones in our eyes that detect yellow and blue. (It’s called dichromatic vision, those with thumbs can google it.) You humans have three cones, the third allowing you to distinguish red and green. Personally, the omission of Christmas colors doesn’t affect me greatly. I don’t care about the hue of the grass where I relieve myself; I don’t care if prosciutto loses its rosy luster, as long as it’s thinly sliced and there’s plenty of it. Like Shakespeare said, a rose by any other name is still as sweet. (That said, TBH I don’t love Shakespeare. Only one dog features in the entirety of his oeuvre and he’s a whelp named Crab in Two Gentlemen of Verona who doesn’t get much airtime and belongs to a servant rather than either of the titular gentlemen…but I digress.)', 'https://assets.vogue.com/photos/66dc9b33fa5235bee879400f/16:9/w_1600%2Cc_limit/SUSANALEXANDRA_SS25_BACKSTAGE_HUNTERABRAMS_01.jpg', CURRENT_TIMESTAMP),
	('Ouch, My Back! The Worst Trend at NYFW Is the Backless Benches', 'Christian Allaire', 'People think we are color blind. This is not so. Canines can, in fact, see color; we have two cones in our eyes that detect yellow and blue. (It’s called dichromatic vision, those with thumbs can google it.) You humans have three cones, the third allowing you to distinguish red and green. Personally, the omission of Christmas colors doesn’t affect me greatly. I don’t care about the hue of the grass where I relieve myself; I don’t care if prosciutto loses its rosy luster, as long.', 'https://assets.vogue.com/photos/66df4ef52f612140712fd4c4/master/w_1600,c_limit/IMG_1800.jpeg', CURRENT_TIMESTAMP);DEFAULT CURRENT_TIMESTAMP );
