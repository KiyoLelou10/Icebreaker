package Socializer.ChatBackend.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "location_entity")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationEntity {

    @Id
    private UUID userId; // Set userId as PRIMARY KEY

    @Column(name = "latitude", nullable = false)
    private double latitude;

    @Column(name = "longitude", nullable = false)
    private double longitude;
}
