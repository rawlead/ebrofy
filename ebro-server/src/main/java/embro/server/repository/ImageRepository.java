package embro.server.repository;

import embro.server.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    @Query("SELECT i FROM Image i ORDER BY id DESC")
    List<Image> findAllOrderByIdDesc();
    Image findByName(String name);
    Image findImageById(Long id);
}
