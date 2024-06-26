import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
import gs_flatten
from awsglue.gluetypes import *
from awsglue.dynamicframe import DynamicFrameCollection
from awsglue.dynamicframe import DynamicFrame
from pyspark.sql.functions import explode, col, when, from_json, schema_of_json, regexp_replace, current_timestamp
from pyspark.sql.types import ArrayType, StringType, IntegerType, BooleanType, FloatType, TimestampType

# Script generated for node CustomTransform_RDS_UserContents


def arrayParse2(glueContext, dfc) -> DynamicFrameCollection:
    df = dfc.select(list(dfc.keys())[0]).toDF()

    # 各列について配列を展開するかどうかを判断
    for col_name in df.columns:
        if isinstance(df.schema[col_name].dataType, ArrayType):
            df = df.withColumn(col_name, explode(col(col_name)))

    # 変更を適用したDataFrameをDynamicFrameに変換
    dyf_expanded = DynamicFrame.fromDF(df, glueContext, "expanded_df")

    # 新しいDynamicFrameCollectionを作成して返す
    return DynamicFrameCollection({"arrayParse2": dyf_expanded}, glueContext)

# Script generated for node CustomTransform_RDS_ElastiCache


def jsonParse1(glueContext, dfc) -> DynamicFrameCollection:
    df = dfc.select(list(dfc.keys())[0]).toDF()

    # 各列についてJSONを解析するかどうかを判断
    for col_name in df.columns:
        if isinstance(df.schema[col_name].dataType, StringType):
            # エスケープされたクオーテーションを通常のクオーテーションに置換
            df = df.withColumn(col_name, regexp_replace(col(col_name), '\\\\"', '"'))
            try:
                # 最初の非null値を取得してスキーマを推測
                sample_data = df.filter(df[col_name].isNotNull()).select(col_name).limit(1).collect()[0][0]
                json_schema = schema_of_json(sample_data)
                # JSONとして解析
                df = df.withColumn(col_name, from_json(col(col_name), json_schema))
            except Exception as e:
                # JSONスキーマの推測または変換でエラーが発生した場合、列は変更されません
                pass

    # 変更を適用したDataFrameをDynamicFrameに変換
    dyf_expanded = DynamicFrame.fromDF(df, glueContext, "expanded_df")

    # 新しいDynamicFrameCollectionを作成して返す
    return DynamicFrameCollection({"jsonParse1": dyf_expanded}, glueContext)

# Script generated for node CustomTransform_RDS_ElastiCache


def renameColumn1(glueContext, dfc) -> DynamicFrameCollection:
    df = dfc.select(list(dfc.keys())[0]).toDF()

    # 列名の置換
    new_column_names = [c.replace(".", "_") for c in df.columns]
    df = df.toDF(*new_column_names)

    # 変更を適用したDataFrameをDynamicFrameに変換
    dyf_expanded = DynamicFrame.fromDF(df, glueContext, "expanded_df")

    # 新しいDynamicFrameCollectionを作成して返す
    return DynamicFrameCollection({"renameColumn1": dyf_expanded}, glueContext)


def _find_null_fields(ctx, schema, path, output, nullStringSet, nullIntegerSet, frame):
    if isinstance(schema, StructType):
        for field in schema:
            new_path = path + "." if path != "" else path
            output = _find_null_fields(ctx, field.dataType, new_path + field.name,
                                       output, nullStringSet, nullIntegerSet, frame)
    elif isinstance(schema, ArrayType):
        if isinstance(schema.elementType, StructType):
            output = _find_null_fields(ctx, schema.elementType, path, output, nullStringSet, nullIntegerSet, frame)
    elif isinstance(schema, NullType):
        output.append(path)
    else:
        x, distinct_set = frame.toDF(), set()
        for i in x.select(path).distinct().collect():
            distinct_ = i[path.split('.')[-1]]
            if isinstance(distinct_, list):
                distinct_set |= set([item.strip() if isinstance(item, str) else item for item in distinct_])
            elif isinstance(distinct_, str):
                distinct_set.add(distinct_.strip())
            else:
                distinct_set.add(distinct_)
        if isinstance(schema, StringType):
            if distinct_set.issubset(nullStringSet):
                output.append(path)
        elif isinstance(schema, IntegerType) or isinstance(schema, LongType) or isinstance(schema, DoubleType):
            if distinct_set.issubset(nullIntegerSet):
                output.append(path)
    return output


def drop_nulls(glueContext, frame, nullStringSet, nullIntegerSet, transformation_ctx) -> DynamicFrame:
    nullColumns = _find_null_fields(frame.glue_ctx, frame.schema(), "", [], nullStringSet, nullIntegerSet, frame)
    return DropFields.apply(frame=frame, paths=nullColumns, transformation_ctx=transformation_ctx)

# Script generated for node CustomTransform_Contents_FoundationBuilding


def jsonParse0(glueContext, dfc) -> DynamicFrameCollection:
    df = dfc.select(list(dfc.keys())[0]).toDF()

    # 各列についてJSONを解析するかどうかを判断
    for col_name in df.columns:
        if isinstance(df.schema[col_name].dataType, StringType):
            # エスケープされたクオーテーションを通常のクオーテーションに置換
            df = df.withColumn(col_name, regexp_replace(col(col_name), '\\\\"', '"'))
            try:
                # 最初の非null値を取得してスキーマを推測
                sample_data = df.filter(df[col_name].isNotNull()).select(col_name).limit(1).collect()[0][0]
                json_schema = schema_of_json(sample_data)
                # JSONとして解析
                df = df.withColumn(col_name, from_json(col(col_name), json_schema))
            except Exception as e:
                # JSONスキーマの推測または変換でエラーが発生した場合、列は変更されません
                pass

    # 変更を適用したDataFrameをDynamicFrameに変換
    dyf_expanded = DynamicFrame.fromDF(df, glueContext, "expanded_df")

    # 新しいDynamicFrameCollectionを作成して返す
    return DynamicFrameCollection({"jsonParse0": dyf_expanded}, glueContext)

# Script generated for node CustomTransform_RDS_ElastiCache


def renameColumn11(glueContext, dfc) -> DynamicFrameCollection:
    df = dfc.select(list(dfc.keys())[0]).toDF()

    # 列名の置換
    new_column_names = [c.replace(".", "_") for c in df.columns]
    df = df.toDF(*new_column_names)

    # 変更を適用したDataFrameをDynamicFrameに変換
    dyf_expanded = DynamicFrame.fromDF(df, glueContext, "expanded_df")

    # 新しいDynamicFrameCollectionを作成して返す
    return DynamicFrameCollection({"renameColumn11": dyf_expanded}, glueContext)

# Script generated for node CustomTransform_RDS_ElastiCache


def arrayParse1(glueContext, dfc) -> DynamicFrameCollection:
    df = dfc.select(list(dfc.keys())[0]).toDF()

    # 各列について配列を展開するかどうかを判断
    for col_name in df.columns:
        if isinstance(df.schema[col_name].dataType, ArrayType):
            df = df.withColumn(col_name, explode(col(col_name)))

    # 変更を適用したDataFrameをDynamicFrameに変換
    dyf_expanded = DynamicFrame.fromDF(df, glueContext, "expanded_df")

    # 新しいDynamicFrameCollectionを作成して返す
    return DynamicFrameCollection({"arrayParse1": dyf_expanded}, glueContext)

# Script generated for node CustomTransform_Contents_FoundationBuilding


def renameColumn01(glueContext, dfc) -> DynamicFrameCollection:
    df = dfc.select(list(dfc.keys())[0]).toDF()

    # 列名の置換
    new_column_names = [c.replace(".", "_") for c in df.columns]
    df = df.toDF(*new_column_names)

    # 変更を適用したDataFrameをDynamicFrameに変換
    dyf_expanded = DynamicFrame.fromDF(df, glueContext, "expanded_df")

    # 新しいDynamicFrameCollectionを作成して返す
    return DynamicFrameCollection({"renameColumn01": dyf_expanded}, glueContext)

# Script generated for node CustomTransform_RDS_UserContents


def jsonParse2(glueContext, dfc) -> DynamicFrameCollection:
    df = dfc.select(list(dfc.keys())[0]).toDF()

    # 各列についてJSONを解析するかどうかを判断
    for col_name in df.columns:
        if isinstance(df.schema[col_name].dataType, StringType):
            # エスケープされたクオーテーションを通常のクオーテーションに置換
            df = df.withColumn(col_name, regexp_replace(col(col_name), '\\\\"', '"'))
            try:
                # 最初の非null値を取得してスキーマを推測
                sample_data = df.filter(df[col_name].isNotNull()).select(col_name).limit(1).collect()[0][0]
                json_schema = schema_of_json(sample_data)
                # JSONとして解析
                df = df.withColumn(col_name, from_json(col(col_name), json_schema))
            except Exception as e:
                # JSONスキーマの推測または変換でエラーが発生した場合、列は変更されません
                pass

    # 変更を適用したDataFrameをDynamicFrameに変換
    dyf_expanded = DynamicFrame.fromDF(df, glueContext, "expanded_df")

    # 新しいDynamicFrameCollectionを作成して返す
    return DynamicFrameCollection({"jsonParse2": dyf_expanded}, glueContext)

# Script generated for node CustomTransform_RDS_UserContents


def renameColumn2(glueContext, dfc) -> DynamicFrameCollection:
    df = dfc.select(list(dfc.keys())[0]).toDF()

    # 列名の置換
    new_column_names = [c.replace(".", "_") for c in df.columns]
    df = df.toDF(*new_column_names)

    # 変更を適用したDataFrameをDynamicFrameに変換
    dyf_expanded = DynamicFrame.fromDF(df, glueContext, "expanded_df")

    # 新しいDynamicFrameCollectionを作成して返す
    return DynamicFrameCollection({"renameColumn2": dyf_expanded}, glueContext)

# Script generated for node CustomTransform_Contents_FoundationBuilding


def renameColumn0(glueContext, dfc) -> DynamicFrameCollection:
    df = dfc.select(list(dfc.keys())[0]).toDF()

    # 列名の置換
    new_column_names = [c.replace(".", "_") for c in df.columns]
    df = df.toDF(*new_column_names)

    # 変更を適用したDataFrameをDynamicFrameに変換
    dyf_expanded = DynamicFrame.fromDF(df, glueContext, "expanded_df")

    # 新しいDynamicFrameCollectionを作成して返す
    return DynamicFrameCollection({"renameColumn0": dyf_expanded}, glueContext)

# Script generated for node CustomTransform_Contents_FoundationBuilding


def arrayParse0(glueContext, dfc) -> DynamicFrameCollection:
    df = dfc.select(list(dfc.keys())[0]).toDF()

    # 各列について配列を展開するかどうかを判断
    for col_name in df.columns:
        if isinstance(df.schema[col_name].dataType, ArrayType):
            df = df.withColumn(col_name, explode(col(col_name)))

    # 変更を適用したDataFrameをDynamicFrameに変換
    dyf_expanded = DynamicFrame.fromDF(df, glueContext, "expanded_df")

    # 新しいDynamicFrameCollectionを作成して返す
    return DynamicFrameCollection({"arrayParse0": dyf_expanded}, glueContext)

# Script generated for node CustomTransform_RDS_UserContents


def renameColumn21(glueContext, dfc) -> DynamicFrameCollection:
    df = dfc.select(list(dfc.keys())[0]).toDF()

    # 列名の置換
    new_column_names = [c.replace(".", "_") for c in df.columns]
    df = df.toDF(*new_column_names)

    # 変更を適用したDataFrameをDynamicFrameに変換
    dyf_expanded = DynamicFrame.fromDF(df, glueContext, "expanded_df")

    # 新しいDynamicFrameCollectionを作成して返す
    return DynamicFrameCollection({"renameColumn21": dyf_expanded}, glueContext)

# Script generated for node CustomTransform_Contents_FoundationBuilding


def defaultValue(glueContext, dfc) -> DynamicFrameCollection:
    df = dfc.select(list(dfc.keys())[0]).toDF()
    # 各列のデータ型を調べて適切なデフォルト値を設定
    for col_name in df.columns:
        data_type = df.schema[col_name].dataType
        if isinstance(data_type, StringType):
            df = df.withColumn(col_name, when(col(col_name).isNull(), "").otherwise(col(col_name)))
        elif isinstance(data_type, IntegerType):
            df = df.withColumn(col_name, when(col(col_name).isNull(), 0).otherwise(col(col_name)))
        elif isinstance(data_type, BooleanType):
            df = df.withColumn(col_name, when(col(col_name).isNull(), False).otherwise(col(col_name)))
        elif isinstance(data_type, TimestampType):
            df = df.withColumn(col_name, when(col(col_name).isNull(), current_timestamp()).otherwise(col(col_name)))
        elif isinstance(data_type, FloatType):
            df = df.withColumn(col_name, when(col(col_name).isNull(), 0.0).otherwise(col(col_name)))
        # 必要に応じて他のデータ型に対するデフォルト値の設定も追加可能です

    dyf_expanded = DynamicFrame.fromDF(df, glueContext, "expanded_df")
    return DynamicFrameCollection({"defaultValue": dyf_expanded}, glueContext)


args = getResolvedOptions(sys.argv, ['JOB_NAME'])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

# Script generated for node AWSGlueDataCatalog_Contents_FoundationBuilding
AWSGlueDataCatalog_Contents_FoundationBuilding_node1714868902758 = glueContext.create_dynamic_frame.from_catalog(
    database="foundation-building-s3-rds", table_name="foundationbuilding", transformation_ctx="AWSGlueDataCatalog_Contents_FoundationBuilding_node1714868902758")

# Script generated for node AWSGlueDataCatalog_RDS_UserContents
AWSGlueDataCatalog_RDS_UserContents_node1714868975560 = glueContext.create_dynamic_frame.from_catalog(
    database="foundation-building-s3-rds", table_name="foundation_building_public_mini_aws_usercontents", transformation_ctx="AWSGlueDataCatalog_RDS_UserContents_node1714868975560")

# Script generated for node AWSGlueDataCatalog_RDS_ElastiCache
AWSGlueDataCatalog_RDS_ElastiCache_node1714868943137 = glueContext.create_dynamic_frame.from_catalog(
    database="foundation-building-s3-rds", table_name="foundation_building_public_mini_aws_elasticache", transformation_ctx="AWSGlueDataCatalog_RDS_ElastiCache_node1714868943137")

# Script generated for node DropNullFields_Contents_FoundationBuilding
DropNullFields_Contents_FoundationBuilding_node1714869009843 = drop_nulls(glueContext, frame=AWSGlueDataCatalog_Contents_FoundationBuilding_node1714868902758, nullStringSet={
                                                                          "", "null"}, nullIntegerSet={}, transformation_ctx="DropNullFields_Contents_FoundationBuilding_node1714869009843")

# Script generated for node DropNullFields_RDS_UserContents
DropNullFields_RDS_UserContents_node1714871290607 = drop_nulls(glueContext, frame=AWSGlueDataCatalog_RDS_UserContents_node1714868975560, nullStringSet={
                                                               "", "null"}, nullIntegerSet={}, transformation_ctx="DropNullFields_RDS_UserContents_node1714871290607")

# Script generated for node DropNullFields_RDS_ElastiCache
DropNullFields_RDS_ElastiCache_node1714870496148 = drop_nulls(glueContext, frame=AWSGlueDataCatalog_RDS_ElastiCache_node1714868943137, nullStringSet={
                                                              "", "null"}, nullIntegerSet={}, transformation_ctx="DropNullFields_RDS_ElastiCache_node1714870496148")

# Script generated for node DropDuplicates_Contents_FoundationBuilding
DropDuplicates_Contents_FoundationBuilding_node1714869947199 = DynamicFrame.fromDF(DropNullFields_Contents_FoundationBuilding_node1714869009843.toDF(
).dropDuplicates(), glueContext, "DropDuplicates_Contents_FoundationBuilding_node1714869947199")

# Script generated for node DropDuplicates_RDS_UserContents
DropDuplicates_RDS_UserContents_node1715020282392 = DynamicFrame.fromDF(DropNullFields_RDS_UserContents_node1714871290607.toDF(
).dropDuplicates(), glueContext, "DropDuplicates_RDS_UserContents_node1715020282392")

# Script generated for node DropDuplicates_RDS_ElastiCache
DropDuplicates_RDS_ElastiCache_node1714870519946 = DynamicFrame.fromDF(DropNullFields_RDS_ElastiCache_node1714870496148.toDF(
).dropDuplicates(), glueContext, "DropDuplicates_RDS_ElastiCache_node1714870519946")

# Script generated for node Flatten_Contents_FoundationBuilding
Flatten_Contents_FoundationBuilding_node1714869994454 = DropDuplicates_Contents_FoundationBuilding_node1714869947199.gs_flatten()

# Script generated for node Flatten_RDS_UserContents
Flatten_RDS_UserContents_node1715020311033 = DropDuplicates_RDS_UserContents_node1715020282392.gs_flatten()

# Script generated for node Flatten_RDS_ElastiCache
Flatten_RDS_ElastiCache_node1714870539687 = DropDuplicates_RDS_ElastiCache_node1714870519946.gs_flatten()

# Script generated for node CustomTransform_Contents_FoundationBuilding
CustomTransform_Contents_FoundationBuilding_node1714870007664 = renameColumn0(glueContext, DynamicFrameCollection(
    {"Flatten_Contents_FoundationBuilding_node1714869994454": Flatten_Contents_FoundationBuilding_node1714869994454}, glueContext))

# Script generated for node CustomTransform_RDS_UserContents
CustomTransform_RDS_UserContents_node1715020326496 = renameColumn2(glueContext, DynamicFrameCollection(
    {"Flatten_RDS_UserContents_node1715020311033": Flatten_RDS_UserContents_node1715020311033}, glueContext))

# Script generated for node CustomTransform_RDS_ElastiCache
CustomTransform_RDS_ElastiCache_node1714870553398 = renameColumn1(glueContext, DynamicFrameCollection(
    {"Flatten_RDS_ElastiCache_node1714870539687": Flatten_RDS_ElastiCache_node1714870539687}, glueContext))

# Script generated for node SelectFromCollection_Contents_FoundationBuilding
SelectFromCollection_Contents_FoundationBuilding_node1714870107696 = SelectFromCollection.apply(dfc=CustomTransform_Contents_FoundationBuilding_node1714870007664, key=list(
    CustomTransform_Contents_FoundationBuilding_node1714870007664.keys())[0], transformation_ctx="SelectFromCollection_Contents_FoundationBuilding_node1714870107696")

# Script generated for node SelectFromCollection_RDS_UserContents
SelectFromCollection_RDS_UserContents_node1715020435738 = SelectFromCollection.apply(dfc=CustomTransform_RDS_UserContents_node1715020326496, key=list(
    CustomTransform_RDS_UserContents_node1715020326496.keys())[0], transformation_ctx="SelectFromCollection_RDS_UserContents_node1715020435738")

# Script generated for node SelectFromCollection_RDS_ElastiCache
SelectFromCollection_RDS_ElastiCache_node1714870593498 = SelectFromCollection.apply(dfc=CustomTransform_RDS_ElastiCache_node1714870553398, key=list(
    CustomTransform_RDS_ElastiCache_node1714870553398.keys())[0], transformation_ctx="SelectFromCollection_RDS_ElastiCache_node1714870593498")

# Script generated for node CustomTransform_Contents_FoundationBuilding
CustomTransform_Contents_FoundationBuilding_node1714870133284 = jsonParse0(glueContext, DynamicFrameCollection(
    {"SelectFromCollection_Contents_FoundationBuilding_node1714870107696": SelectFromCollection_Contents_FoundationBuilding_node1714870107696}, glueContext))

# Script generated for node CustomTransform_RDS_UserContents
CustomTransform_RDS_UserContents_node1715020467746 = jsonParse2(glueContext, DynamicFrameCollection(
    {"SelectFromCollection_RDS_UserContents_node1715020435738": SelectFromCollection_RDS_UserContents_node1715020435738}, glueContext))

# Script generated for node CustomTransform_RDS_ElastiCache
CustomTransform_RDS_ElastiCache_node1714870615935 = jsonParse1(glueContext, DynamicFrameCollection(
    {"SelectFromCollection_RDS_ElastiCache_node1714870593498": SelectFromCollection_RDS_ElastiCache_node1714870593498}, glueContext))

# Script generated for node SelectFromCollection_Contents_FoundationBuilding
SelectFromCollection_Contents_FoundationBuilding_node1714870203157 = SelectFromCollection.apply(dfc=CustomTransform_Contents_FoundationBuilding_node1714870133284, key=list(
    CustomTransform_Contents_FoundationBuilding_node1714870133284.keys())[0], transformation_ctx="SelectFromCollection_Contents_FoundationBuilding_node1714870203157")

# Script generated for node SelectFromCollection_RDS_UserContents
SelectFromCollection_RDS_UserContents_node1715020509644 = SelectFromCollection.apply(dfc=CustomTransform_RDS_UserContents_node1715020467746, key=list(
    CustomTransform_RDS_UserContents_node1715020467746.keys())[0], transformation_ctx="SelectFromCollection_RDS_UserContents_node1715020509644")

# Script generated for node SelectFromCollection_RDS_ElastiCache
SelectFromCollection_RDS_ElastiCache_node1714870652667 = SelectFromCollection.apply(dfc=CustomTransform_RDS_ElastiCache_node1714870615935, key=list(
    CustomTransform_RDS_ElastiCache_node1714870615935.keys())[0], transformation_ctx="SelectFromCollection_RDS_ElastiCache_node1714870652667")

# Script generated for node Flatten_Contents_FoundationBuilding
Flatten_Contents_FoundationBuilding_node1714870244577 = SelectFromCollection_Contents_FoundationBuilding_node1714870203157.gs_flatten()

# Script generated for node Flatten_RDS_UserContents
Flatten_RDS_UserContents_node1715020527892 = SelectFromCollection_RDS_UserContents_node1715020509644.gs_flatten()

# Script generated for node Flatten_RDS_ElastiCache
Flatten_RDS_ElastiCache_node1714870677889 = SelectFromCollection_RDS_ElastiCache_node1714870652667.gs_flatten()

# Script generated for node CustomTransform_Contents_FoundationBuilding
CustomTransform_Contents_FoundationBuilding_node1714870259446 = renameColumn01(glueContext, DynamicFrameCollection(
    {"Flatten_Contents_FoundationBuilding_node1714870244577": Flatten_Contents_FoundationBuilding_node1714870244577}, glueContext))

# Script generated for node CustomTransform_RDS_UserContents
CustomTransform_RDS_UserContents_node1715020550202 = renameColumn21(glueContext, DynamicFrameCollection(
    {"Flatten_RDS_UserContents_node1715020527892": Flatten_RDS_UserContents_node1715020527892}, glueContext))

# Script generated for node CustomTransform_RDS_ElastiCache
CustomTransform_RDS_ElastiCache_node1714870699138 = renameColumn11(glueContext, DynamicFrameCollection(
    {"Flatten_RDS_ElastiCache_node1714870677889": Flatten_RDS_ElastiCache_node1714870677889}, glueContext))

# Script generated for node SelectFromCollection_Contents_FoundationBuilding
SelectFromCollection_Contents_FoundationBuilding_node1714870298945 = SelectFromCollection.apply(dfc=CustomTransform_Contents_FoundationBuilding_node1714870259446, key=list(
    CustomTransform_Contents_FoundationBuilding_node1714870259446.keys())[0], transformation_ctx="SelectFromCollection_Contents_FoundationBuilding_node1714870298945")

# Script generated for node SelectFromCollection_RDS_UserContents
SelectFromCollection_RDS_UserContents_node1715020625786 = SelectFromCollection.apply(dfc=CustomTransform_RDS_UserContents_node1715020550202, key=list(
    CustomTransform_RDS_UserContents_node1715020550202.keys())[0], transformation_ctx="SelectFromCollection_RDS_UserContents_node1715020625786")

# Script generated for node SelectFromCollection_RDS_ElastiCache
SelectFromCollection_RDS_ElastiCache_node1714870785371 = SelectFromCollection.apply(dfc=CustomTransform_RDS_ElastiCache_node1714870699138, key=list(
    CustomTransform_RDS_ElastiCache_node1714870699138.keys())[0], transformation_ctx="SelectFromCollection_RDS_ElastiCache_node1714870785371")

# Script generated for node CustomTransform_Contents_FoundationBuilding
CustomTransform_Contents_FoundationBuilding_node1714870320366 = arrayParse0(glueContext, DynamicFrameCollection(
    {"SelectFromCollection_Contents_FoundationBuilding_node1714870298945": SelectFromCollection_Contents_FoundationBuilding_node1714870298945}, glueContext))

# Script generated for node CustomTransform_RDS_UserContents
CustomTransform_RDS_UserContents_node1715020704490 = arrayParse2(glueContext, DynamicFrameCollection(
    {"SelectFromCollection_RDS_UserContents_node1715020625786": SelectFromCollection_RDS_UserContents_node1715020625786}, glueContext))

# Script generated for node CustomTransform_RDS_ElastiCache
CustomTransform_RDS_ElastiCache_node1714870810790 = arrayParse1(glueContext, DynamicFrameCollection(
    {"SelectFromCollection_RDS_ElastiCache_node1714870785371": SelectFromCollection_RDS_ElastiCache_node1714870785371}, glueContext))

# Script generated for node SelectFromCollection_Contents_FoundationBuilding
SelectFromCollection_Contents_FoundationBuilding_node1714870399463 = SelectFromCollection.apply(dfc=CustomTransform_Contents_FoundationBuilding_node1714870320366, key=list(
    CustomTransform_Contents_FoundationBuilding_node1714870320366.keys())[0], transformation_ctx="SelectFromCollection_Contents_FoundationBuilding_node1714870399463")

# Script generated for node SelectFromCollection_RDS_UserContents
SelectFromCollection_RDS_UserContents_node1715020741880 = SelectFromCollection.apply(dfc=CustomTransform_RDS_UserContents_node1715020704490, key=list(
    CustomTransform_RDS_UserContents_node1715020704490.keys())[0], transformation_ctx="SelectFromCollection_RDS_UserContents_node1715020741880")

# Script generated for node SelectFromCollection_RDS_ElastiCache
SelectFromCollection_RDS_ElastiCache_node1714870854961 = SelectFromCollection.apply(dfc=CustomTransform_RDS_ElastiCache_node1714870810790, key=list(
    CustomTransform_RDS_ElastiCache_node1714870810790.keys())[0], transformation_ctx="SelectFromCollection_RDS_ElastiCache_node1714870854961")

# Script generated for node DropNullFields_Contents_FoundationBuilding
DropNullFields_Contents_FoundationBuilding_node1714870448147 = drop_nulls(glueContext, frame=SelectFromCollection_Contents_FoundationBuilding_node1714870399463, nullStringSet={
                                                                          "", "null"}, nullIntegerSet={}, transformation_ctx="DropNullFields_Contents_FoundationBuilding_node1714870448147")

# Script generated for node DropNullFields_RDS_UserContents
DropNullFields_RDS_UserContents_node1715020769540 = drop_nulls(glueContext, frame=SelectFromCollection_RDS_UserContents_node1715020741880, nullStringSet={
                                                               "", "null"}, nullIntegerSet={}, transformation_ctx="DropNullFields_RDS_UserContents_node1715020769540")

# Script generated for node DropNullFields_RDS_ElastiCache
DropNullFields_RDS_ElastiCache_node1714870869561 = drop_nulls(glueContext, frame=SelectFromCollection_RDS_ElastiCache_node1714870854961, nullStringSet={
                                                              "", "null"}, nullIntegerSet={}, transformation_ctx="DropNullFields_RDS_ElastiCache_node1714870869561")

# Script generated for node DropDuplicates_Contents_FoundationBuilding
DropDuplicates_Contents_FoundationBuilding_node1714870464044 = DynamicFrame.fromDF(DropNullFields_Contents_FoundationBuilding_node1714870448147.toDF(
).dropDuplicates(), glueContext, "DropDuplicates_Contents_FoundationBuilding_node1714870464044")

# Script generated for node DropDuplicates_RDS_UserContents
DropDuplicates_RDS_UserContents_node1715020785101 = DynamicFrame.fromDF(DropNullFields_RDS_UserContents_node1715020769540.toDF(
).dropDuplicates(), glueContext, "DropDuplicates_RDS_UserContents_node1715020785101")

# Script generated for node DropDuplicates_RDS_ElastiCache
DropDuplicates_RDS_ElastiCache_node1714870885000 = DynamicFrame.fromDF(DropNullFields_RDS_ElastiCache_node1714870869561.toDF(
).dropDuplicates(), glueContext, "DropDuplicates_RDS_ElastiCache_node1714870885000")

# Script generated for node Join_Contents_FoundationBuilding_RDS_UserContents
DropDuplicates_RDS_UserContents_node1715020785101DF = DropDuplicates_RDS_UserContents_node1715020785101.toDF()
DropDuplicates_Contents_FoundationBuilding_node1714870464044DF = DropDuplicates_Contents_FoundationBuilding_node1714870464044.toDF()
Join_Contents_FoundationBuilding_RDS_UserContents_node1715020902907 = DynamicFrame.fromDF(DropDuplicates_RDS_UserContents_node1715020785101DF.join(DropDuplicates_Contents_FoundationBuilding_node1714870464044DF, (
    DropDuplicates_RDS_UserContents_node1715020785101DF['user_name'] == DropDuplicates_Contents_FoundationBuilding_node1714870464044DF['username']), "left"), glueContext, "Join_Contents_FoundationBuilding_RDS_UserContents_node1715020902907")

# Script generated for node Join_Contents_FoundationBuilding_RDS_ElastiCache
DropDuplicates_RDS_ElastiCache_node1714870885000DF = DropDuplicates_RDS_ElastiCache_node1714870885000.toDF()
DropDuplicates_Contents_FoundationBuilding_node1714870464044DF = DropDuplicates_Contents_FoundationBuilding_node1714870464044.toDF()
Join_Contents_FoundationBuilding_RDS_ElastiCache_node1714870909061 = DynamicFrame.fromDF(DropDuplicates_RDS_ElastiCache_node1714870885000DF.join(DropDuplicates_Contents_FoundationBuilding_node1714870464044DF, (
    DropDuplicates_RDS_ElastiCache_node1714870885000DF['user_contents_id'] == DropDuplicates_Contents_FoundationBuilding_node1714870464044DF['username']), "right"), glueContext, "Join_Contents_FoundationBuilding_RDS_ElastiCache_node1714870909061")

# Script generated for node Join_Contents_RDS
Join_Contents_FoundationBuilding_RDS_UserContents_node1715020902907DF = Join_Contents_FoundationBuilding_RDS_UserContents_node1715020902907.toDF()
Join_Contents_FoundationBuilding_RDS_ElastiCache_node1714870909061DF = Join_Contents_FoundationBuilding_RDS_ElastiCache_node1714870909061.toDF()
Join_Contents_RDS_node1715021175453 = DynamicFrame.fromDF(Join_Contents_FoundationBuilding_RDS_UserContents_node1715020902907DF.join(Join_Contents_FoundationBuilding_RDS_ElastiCache_node1714870909061DF, (
    Join_Contents_FoundationBuilding_RDS_UserContents_node1715020902907DF['username'] == Join_Contents_FoundationBuilding_RDS_ElastiCache_node1714870909061DF['username']), "outer"), glueContext, "Join_Contents_RDS_node1715021175453")

# Script generated for node DropDuplicates_Contents_RDS
DropDuplicates_Contents_RDS_node1715022446285 = DynamicFrame.fromDF(
    Join_Contents_RDS_node1715021175453.toDF().dropDuplicates(), glueContext, "DropDuplicates_Contents_RDS_node1715022446285")

# Script generated for node CustomTransform_RDS_ElastiCache
CustomTransform_Contents_RDS_node1714870813791 = defaultValue(glueContext, DynamicFrameCollection(
    {"DropDuplicates_Contents_RDS_node1715022446285": DropDuplicates_Contents_RDS_node1715022446285}, glueContext))

# Script generated for node SelectFromCollection_Contents_FoundationBuilding
SelectFromCollection_Contents_FoundationBuilding_node1714870393791 = SelectFromCollection.apply(dfc=CustomTransform_Contents_RDS_node1714870813791, key=list(
    CustomTransform_Contents_RDS_node1714870813791.keys())[0], transformation_ctx="SelectFromCollection_Contents_FoundationBuilding_node1714870399463")

# Script generated for node AmazonS3_Contents_RDS
AmazonS3_Contents_RDS_node1715022580490 = glueContext.write_dynamic_frame.from_options(frame=SelectFromCollection_Contents_FoundationBuilding_node1714870393791, connection_type="s3", format="glueparquet", connection_options={
                                                                                       "path": "s3://foundation-building-app-objects-519502641206/Glue/appName=FoundationBuilding/dataType=Table/", "partitionKeys": []}, format_options={"compression": "snappy"}, transformation_ctx="AmazonS3_Contents_RDS_node1715022580490")

job.commit()
