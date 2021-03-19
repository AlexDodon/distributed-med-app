FROM maven:3.6.3-jdk-8 AS builder

COPY ./src/ /root/src
COPY ./pom.xml /root/
WORKDIR /root
RUN mvn package -Dmaven.test.skip
RUN java -Djarmode=layertools -jar /root/target/medicalBackend-0.0.1-SNAPSHOT.jar list
RUN java -Djarmode=layertools -jar /root/target/medicalBackend-0.0.1-SNAPSHOT.jar extract
RUN ls -l /root

FROM openjdk:8-jre

ENV TZ=UTC
ENV DB_IP=ec2-54-246-67-245.eu-west-1.compute.amazonaws.com
ENV DB_PORT=5432
ENV DB_USER=cmgehnuirdqjnm
ENV DB_PASSWORD=607184d22383cf0e2b14ea75907d6f5475b0a67a5f907f50b29f86f287814607
ENV DB_DBNAME=dp2n56v3ak2gc

ENV BROKER_HOST=roedeer.rmq.cloudamqp.com
ENV BROKER_VHOST=vnchtioo
ENV BROKER_USERNAME=vnchtioo
ENV BROKER_PASSWORD=BydwQLVAZoaARUMHBfalp8MVDrB152tu

COPY --from=builder /root/dependencies/ ./
COPY --from=builder /root/snapshot-dependencies/ ./

RUN sleep 10
COPY --from=builder /root/spring-boot-loader/ ./
COPY --from=builder /root/application/ ./
ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher","-XX:+UseContainerSupport -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:MaxRAMFraction=1 -Xms128m -Xmx128m -XX:+UseG1GC -XX:+UseSerialGC -Xss512k -XX:MaxRAM=72m"]
